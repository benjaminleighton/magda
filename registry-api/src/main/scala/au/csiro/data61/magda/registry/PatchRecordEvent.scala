package au.csiro.data61.magda.registry

import gnieh.diffson.sprayJson._

case class PatchRecordEvent(id: String, patch: JsonPatch)

object PatchRecordEvent {
  val Id = 3 // from EventTypes table
}
