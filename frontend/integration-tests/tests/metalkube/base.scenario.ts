import { browser } from 'protractor';
import { execSync } from 'child_process';

import { appHost, testName } from '../../protractor.conf';
import * as crudView from '../../views/crud.view';

describe('Create a test namespace', () => {
  it(`creates test namespace ${testName} if necessary`, async() => {
    // Use projects if OpenShift so non-admin users can run tests.
    const resource = browser.params.openshift === 'true' ? 'projects' : 'namespaces';
    await browser.get(`${appHost}/k8s/cluster/${resource}`);
    await crudView.isLoaded();
    const exists = await crudView.rowForName(testName).isPresent();
    if (!exists) {
      execSync(`oc new-project ${testName}`);
    }
    expect(browser.getCurrentUrl()).toContain(appHost);
  });
});
