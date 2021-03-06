import CreationFailure from './CreationFailure';

export default class ConnectionResult {
    public aspectDefinitionsConnected = 0;
    public organizationsConnected = 0;
    public datasetsConnected = 0;
    public distributionsConnected = 0;

    public aspectDefinitionFailures = Array<CreationFailure>();
    public organizationFailures = Array<CreationFailure>();
    public datasetFailures = Array<CreationFailure>();
    public distributionFailures = Array<CreationFailure>();

    public summarize(): string {
        let result = '';

        result += 'Aspect Definitions Connected: ' + this.aspectDefinitionsConnected + '\n';
        result += 'Datasets Connected: ' + this.datasetsConnected + '\n';
        result += 'Distributions Connected: ' + this.distributionsConnected + '\n';
        result += 'Organizations Connected: ' + this.organizationsConnected + '\n';

        if (this.aspectDefinitionFailures.length > 0) {
            result += 'Aspect Definition Failures:\n' + JSON.stringify(this.aspectDefinitionFailures, undefined, '  ') + '\n';
        }
        if (this.organizationFailures.length > 0) {
            result += 'Organization Failures:\n' + JSON.stringify(this.organizationFailures, undefined, '  ') + '\n';
        }
        if (this.datasetFailures.length > 0) {
            result += 'Dataset Failures:\n' + JSON.stringify(this.datasetFailures, undefined, '  ') + '\n';
        }
        if (this.distributionFailures.length > 0) {
            result += 'Distribution Failures:\n' + JSON.stringify(this.distributionFailures, undefined, '  ') + '\n';
        }

        return result;
    }

    public static combine(...results: ConnectionResult[]): ConnectionResult {
        const total = new ConnectionResult();

        results.forEach(result => {
            total.aspectDefinitionsConnected += result.aspectDefinitionsConnected;
            total.organizationsConnected += result.organizationsConnected;
            total.datasetsConnected += result.datasetsConnected;
            total.distributionsConnected += result.distributionsConnected;

            total.aspectDefinitionFailures.push(...result.aspectDefinitionFailures);
            total.organizationFailures.push(...result.organizationFailures);
            total.datasetFailures.push(...result.datasetFailures);
            total.distributionFailures.push(...result.distributionFailures);
        });

        return total;
    }
}
