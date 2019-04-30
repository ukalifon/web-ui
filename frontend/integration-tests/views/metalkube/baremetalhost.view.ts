import { browser, ExpectedConditions as until, by, $ } from 'protractor';
import { rowForName } from '../crud.view';

export const confirmBtn = $('#confirm-action');

export const confirmAction = () => browser.wait(until.presenceOf(confirmBtn))
  .then(() => confirmBtn.click())
  .then(() => browser.wait(until.not(until.presenceOf(confirmBtn))));

export const hostname = (name: string) => rowForName(name).$('.co-m-resource-baremetalhost + a');
export const status = (name: string) => rowForName(name).$('.kubevirt-host-status__icon').element(by.xpath('..'));
