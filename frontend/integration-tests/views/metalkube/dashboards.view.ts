import { browser, element, by , $$ } from 'protractor';
import { waitForNone } from '../../protractor.conf';

export const untilNoLoadersPresent = waitForNone($$('.co-m-loader'));
export const isLoaded = () => browser.wait(untilNoLoadersPresent).then(() => browser.sleep(2000));

// Usage example:
// await dashboardView.inventoryItemLabel(0).getText()
export function inventoryItemLabel(rowNumber) {
  return element(by.xpath(`(//div[@class="kubevirt-inventory__row-title"])[${rowNumber + 1}]`));
}

// Usage example:
// await dashboardView.inventoryUpCounter(0).getText()
export function inventoryUpCounter(rowNumber) {
  // Explaining the xpath:
  // There is an array of 6 kubevirt-inventory__row-status items (one for each line in the inventory).
  // Then we look for a kubevirt-inventory__row-status-item which has a kubevirt-inventory__row-status-item-icon--ok
  // under it, and go __back up__ to the parent (with "..") and find the span under it. This gives us
  // the counter *next to* the kubevirt-inventory__row-status-item-icon--ok.
  return element(by.xpath(`(//div[@class="kubevirt-inventory__row-status"])[${rowNumber + 1}]` +
    '/div[contains(@class, "kubevirt-inventory__row-status-item")]' +
    '/span[contains(@class, "kubevirt-inventory__row-status-item-icon--ok")]' +
    '/../span[contains(@class, "kubevirt-inventory__row-status-item-text")]'));
}

// Usage example:
// await dashboardView.inventoryDownCounter(0).getText()
export function inventoryDownCounter(rowNumber) {
  // Similar xpath explanation to the one in inventoryUpCounter(), but now we're finding the counter
  // next to the kubevirt-inventory__row-status-item-icon--error.
  return element(by.xpath(`(//div[@class="kubevirt-inventory__row-status"])[${rowNumber + 1}]` +
    '/div[contains(@class, "kubevirt-inventory__row-status-item")]' +
    '/span[contains(@class, "kubevirt-inventory__row-status-item-icon--error")]' +
    '/../span[contains(@class, "kubevirt-inventory__row-status-item-text")]'));
}

// substrings to identify the rows in the inventory card
export const INVENTORY_NODES = ' Nodes';
export const INVENTORY_HOSTS = ' Hosts';
export const INVENTORY_PVCS = ' PVCs';
export const INVENTORY_PODS = ' Pods';
export const INVENTORY_VMS = ' VMs';
export const INVENTORY_DISKS = ' Disks';

// Usage example:
// const rowNumber = await dashboardView.inventoryRow(dashboardView.INVENTORY_HOSTS);
export const inventoryRow = async(substrInventory) => {
  const elements = await $$('.kubevirt-inventory__row-title');
  let i; // not using a forEach loop because you can't break or return from it
  for (i = 0; i < elements.length; i++) {
    const inventoryLabel = await elements[i].getText();
    if (inventoryLabel.indexOf(substrInventory) > -1) {
      return new Promise(resolve => {
        resolve(i);
      });
    }
  }
};

// Usage example:
// await dashboardView.sysEventTime(0).getText()
export function sysEventTime(rowNumber) {
  return element(by.xpath(`(//div[@class="co-sysevent__header"])[${rowNumber + 1}]/small`));
}

// Usage example:
// await dashboardView.sysEventIcon(0).getAttribute('class')
export function sysEventIcon(rowNumber) {
  return element(by.xpath(`(//div[@class="co-sysevent__subheader"])[${rowNumber + 1}]/span[1]`));
}

// Usage example:
// await dashboardView.sysEventResourceIcon(0).getAttribute('class')
export function sysEventResourceIcon(rowNumber) {
  return element(by.xpath(`(//div[@class="co-sysevent__subheader"])[${rowNumber + 1}]` +
    '/span[contains(@class, "co-sysevent__resourcelink")]' +
    '/span[contains(@class, "co-m-resource-icon")]'));
}

// Usage example:
// await dashboardView.sysEventResourceName(0).getText()
export function sysEventResourceName(rowNumber) {
  return element(by.xpath(`(//div[@class="co-sysevent__subheader"])[${rowNumber + 1}]` +
    '/span[contains(@class, "co-sysevent__resourcelink")]' +
    '/a[@class="co-resource-item__resource-name"]'));
}

// Usage example:
// await dashboardView.sysEventSource(0).getText()
export function sysEventSource(rowNumber) {
  return element(by.xpath(`(//div[@class="co-sysevent__header"])[${rowNumber + 1}]` +
    '/div[@class="co-sysevent__details"]' +
    '/small[@class="co-sysevent__source"]'));
}

// Usage example:
// await dashboardView.sysEventMessage(0).getText()
export function sysEventMessage(rowNumber) {
  return element(by.xpath(`(//div[contains(@class, "co-sysevent__message")])[${rowNumber + 1}]`));
}

// Usage example:
// await dashboardView.alertItemIcon(0).getAttribute('class')
export function alertItemIcon(rowNumber) {
  return element(by.xpath('//div[@class="kubevirt-alert__alerts-body"]' +
    `/div[@class="kubevirt-alert__item"][${rowNumber + 1}]` +
    '/span'));
}

// Usage example:
// await dashboardView.alertItemMessage(0).getText()
export function alertItemMessage(rowNumber) {
  return element(by.xpath('//div[@class="kubevirt-alert__alerts-body"]' +
    `/div[@class="kubevirt-alert__item"][${rowNumber + 1}]` +
    '/div[@class="kubevirt-alert__item-message"]'));
}

// Utility function: getTextIfPresent
export async function getTextIfPresent(elem, textIfNotPresent='') {
  if (await elem.isPresent()) {
    return elem.getText();
  }
  return new Promise(resolve => {
    resolve(textIfNotPresent);
  });
}
