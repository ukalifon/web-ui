import { browser } from 'protractor';
const execSync = require('child_process').execSync;

import { appHost } from '../../protractor.conf';
import * as dashboardView from '../../views/metalkube/dashboards.view';

describe('Inventory card', () => {
  it('Node count is displayed', async() => {
    await browser.get(`${appHost}/dashboards`);
    await dashboardView.isLoaded();
    browser.sleep(10000);

    // get the number of ready and not ready nodes from the CLI
    let readyNodes = 0;
    let notReadyNodes = 0;
    const output = execSync('oc get nodes', { encoding: 'utf-8' });
    const lines = output.split('\n');
    let i;
    for (i = 0; i < lines.length; i++) {
      if (lines[i].indexOf(' Ready ') > 0) {
        readyNodes++;
      }
      if (lines[i].indexOf(' NotReady ') > 0) {
        notReadyNodes++;
      }
    }
    expect(await dashboardView.inventoryItemLabel(dashboardView.INVENTORY_NODES).getText()).toEqual(`${readyNodes + notReadyNodes} Nodes`);
    let upNodes = 0, downNodes = 0;
    let elem = dashboardView.inventoryUpCounter(dashboardView.INVENTORY_NODES);
    if (await elem.isPresent()) { // if the counter is 0 the element is not displayed
      upNodes = Number(await elem.getText());
    }
    elem = dashboardView.inventoryDownCounter(dashboardView.INVENTORY_NODES);
    if (await elem.isPresent()) { // if the counter is 0 the element is not displayed
      downNodes = Number(await elem.getText());
    }
    expect(upNodes === readyNodes).toBe(true);
    expect(downNodes === notReadyNodes).toBe(true);
  });

  it('Host count is displayed', async() => {
    // get the hosts and their statuses from the CLI
    let readyHosts = 0;
    let notReadyHosts = 0;
    const output = execSync('oc get baremetalhosts -n openshift-machine-api', { encoding: 'utf-8' });
    const lines = output.split('\n');
    let i;
    for (i = 1; i < lines.length; i++) {
      if (lines[i].trim().length > 1) {
        if (lines[i].indexOf(' OK ') > 0) {
          readyHosts++;
        } else {
          notReadyHosts++;
        }
      }
    }
    expect(await dashboardView.inventoryItemLabel(dashboardView.INVENTORY_HOSTS).getText()).toEqual(`${readyHosts + notReadyHosts} Hosts`);
    let upHosts = 0, downHosts = 0;
    let elem = dashboardView.inventoryUpCounter(dashboardView.INVENTORY_HOSTS);
    if (await elem.isPresent()) {
      upHosts = Number(await elem.getText());
    }
    elem = dashboardView.inventoryDownCounter(dashboardView.INVENTORY_HOSTS);
    if (await elem.isPresent()) {
      downHosts = Number(await elem.getText());
    }
    expect(upHosts === readyHosts).toBe(true);
    expect(downHosts === notReadyHosts).toBe(true);
  });
});
