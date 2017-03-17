package au.csiro.data61.magda.crawler

import scala.concurrent.Await
import scala.concurrent.Future
import scala.concurrent.duration.Duration
import scala.concurrent.duration.DurationInt

import org.scalacheck.Gen
import org.scalatest.BeforeAndAfterAll
import org.scalatest.FunSpecLike
import org.scalatest.Matchers

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import akka.testkit.TestKit
import au.csiro.data61.magda.AppConfig
import au.csiro.data61.magda.external.ExternalInterface
import au.csiro.data61.magda.external.InterfaceConfig
import au.csiro.data61.magda.model.misc.DataSet
import au.csiro.data61.magda.search.SearchIndexer
import au.csiro.data61.magda.test.util.Generators
import au.csiro.data61.magda.test.util.IndexerGenerators
import au.csiro.data61.magda.test.util.MagdaGeneratorTest
import au.csiro.data61.magda.test.util.TestActorSystem
import java.time.Instant
import akka.stream.scaladsl.Source
import akka.NotUsed
import akka.stream.scaladsl.Sink

class CrawlerTest extends TestKit(TestActorSystem.actorSystem) with FunSpecLike with BeforeAndAfterAll with Matchers with MagdaGeneratorTest {
  implicit val ec = system.dispatcher
  implicit val config = AppConfig.conf(None)
  implicit val materializer = ActorMaterializer()

  implicit class RichFuture[T](future: Future[T]) {
    def await(implicit duration: Duration = 10.seconds): T = Await.result(future, duration)
  }

  describe("crawler") {
    it("should correctly pass datasets to indexer") {
      forAll(Gen.listOf(Generators.dataSetGen), IndexerGenerators.interfaceConfGen) { (dataSets, interfaceConfig) =>
        val interface = new ExternalInterface {
          override def getInterfaceConfig(): InterfaceConfig = interfaceConfig
          override def getDataSets(start: Long = 0, number: Int = 10): Future[List[DataSet]] = Future(dataSets.drop(start.toInt).take(number))
          override def getTotalDataSetCount(): Future[Long] = Future(dataSets.length)
        }

        val externalInterfaces = Seq(interface)

        val indexer = new SearchIndexer {
          var list: List[DataSet] = List()

          override def index(source: InterfaceConfig, dataSetStream: Source[DataSet, NotUsed]) = {
            dataSetStream
              .map(dataSet => list :+ dataSet)
              .runWith(Sink.seq)
              .map(seq => new SearchIndexer.IndexResult(seq.length, Seq()))
          }
          override def snapshot(): Future[Unit] = Future(Unit)

          override def trim(source: InterfaceConfig, before: Instant): Future[Unit] = Future(Unit)
          //          def needsReindexing(source: InterfaceConfig): Future[Boolean] = Future(true)
          def ready() = Future(Unit)
        }

        val crawler = Crawler(externalInterfaces)

        crawler.crawl(indexer).await

        indexer.list.zip(dataSets).foreach {
          case (indexedDS, inputDS) =>
            indexedDS.copy(publisher = None) should equal(inputDS.copy(publisher = None))

            if (inputDS.publisher.isEmpty) {
              indexedDS.publisher.flatMap(_.name) should equal(interfaceConfig.defaultPublisherName)
            }
        }
      }
    }
  }
}