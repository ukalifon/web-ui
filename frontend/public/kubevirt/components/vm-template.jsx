import React from 'react';
import * as _ from 'lodash-es';
import { VmTemplateModel, NamespaceModel } from '../models';
import { ListPage, List, ResourceRow, ListHeader, ColHead } from './factory/okdfactory';
import { ResourceLink, ResourceKebab, Kebab } from './utils/okdutils';
import { DASHES } from './utils/constants';
import { openCreateVmWizard } from './modals/create-vm-modal';
import { TemplateSource, getTemplateOperatingSystems, getTemplateFlavors } from 'kubevirt-web-ui-components';

const menuActions = [Kebab.factory.Delete];
const mainRowStyle = 'col-lg-2 col-sm-4 col-xs-4';
const otherRowStyle = 'col-lg-2 hidden-sm hidden-xs';

const VmTemplateHeader = props => <ListHeader>
  <ColHead {...props} className={mainRowStyle} sortField="metadata.name">Name</ColHead>
  <ColHead {...props} className={mainRowStyle} sortField="metadata.namespace">Namespace</ColHead>
  <ColHead {...props} className={mainRowStyle} sortField="metadata.annotations.description">Description</ColHead>
  <ColHead {...props} className={otherRowStyle}>Source</ColHead>
  <ColHead {...props} className={otherRowStyle}>OS</ColHead>
  <ColHead {...props} className={otherRowStyle}>Flavor</ColHead>
</ListHeader>;

const VmTemplateRow = ({obj: template}) => <ResourceRow obj={template}>
  <div className={mainRowStyle}>
    <ResourceLink kind={VmTemplateModel.kind} name={template.metadata.name} namespace={template.metadata.namespace} title={template.metadata.uid} />
  </div>
  <div className={mainRowStyle}>
    <ResourceLink kind={NamespaceModel.kind} name={template.metadata.namespace} title={template.metadata.namespace} />
  </div>
  <div className={mainRowStyle}>
    {_.get(template.metadata, 'annotations.description', DASHES)}
  </div>
  <div className="dropdown-kebab-pf">
    <ResourceKebab actions={menuActions} kind={VmTemplateModel.kind} resource={template} />
  </div>
  <div className={otherRowStyle}>
    <div className="co-resource-list__item--templateSource">
      <TemplateSource template={template} />
    </div>
  </div>
  <div className={otherRowStyle}>
    {getTemplateOperatingSystems([template])[0]}
  </div>
  <div className={otherRowStyle}>
    {getTemplateFlavors([template])[0]}
  </div>
</ResourceRow>;


const VmTemplateList = props => <List {...props} Header={VmTemplateHeader} Row={VmTemplateRow} />;

export const VmTemplatesPageTitle = 'Virtual Machine Templates';

const createItems = {
  wizard: 'Create with Wizard',
};

const createProps = namespace => ({
  items: createItems,
  createLink: () => () => openCreateVmWizard(namespace, true),
});

export const VirtualMachineTemplatesPage = props => <ListPage
  {...props}
  title={VmTemplatesPageTitle}
  selector={VmTemplateModel.selector}
  kind={VmTemplateModel.kind}
  ListComponent={VmTemplateList}
  createProps={createProps(props.namespace)}
  canCreate={true}
/>;
