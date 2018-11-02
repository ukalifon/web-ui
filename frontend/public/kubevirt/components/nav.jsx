import * as React from 'react';
import * as classNames from 'classnames';

import * as routingImg from '../../imgs/routing.svg';
import * as routingActiveImg from '../../imgs/routing-active.svg';
import { FLAGS } from '../../features';

import { NavSection, ClusterPickerNavSection, UserNavSection } from './okdcomponents';
import { ChargebackReportModel, DeploymentConfigModel } from '../models';
import { referenceForModel } from '../module/okdk8s';

// With respect to keep changes to OKD codebase at bare minimum,
// the navigation needs to be reconstructed.
// The ResourceNSLink, HrefLink, Sep, MonitoringNavSection components are passed as props to eliminate the need for additional changes in OKD core code. Ugly anti-pattern, but serves its purpose.
const Nav = ({ isOpen, onToggle, close, scroller, onWheel, searchStartsWith, ResourceNSLink, HrefLink, Sep, ResourceClusterLink, MonitoringNavSection, clusterSettingsStartsWith, rolesStartsWith, rolebindingsStartsWith, quotaStartsWith }) => {
  return (
    <React.Fragment>
      <button type="button" className="sidebar-toggle" aria-controls="sidebar" aria-expanded={isOpen} onClick={onToggle}>
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar" aria-hidden="true"></span>
        <span className="icon-bar" aria-hidden="true"></span>
        <span className="icon-bar" aria-hidden="true"></span>
      </button>
      <div id="sidebar" className={classNames({'open': isOpen})}>
        <ClusterPickerNavSection />
        <div ref={scroller} onWheel={onWheel} className="navigation-container">
          <NavSection text="Home" icon="pficon pficon-home">
            <HrefLink href="/overview" name="Overview" activePath="/overview/" onClick={close} />
            <HrefLink href="/status" name="Status" activePath="/status/" onClick={close} />
            {/*<HrefLink href="/catalog" name="Catalog" activePath="/catalog/" onClick={close} />*/}
            <HrefLink href="/search" name="Search" onClick={close} startsWith={searchStartsWith} />
            <ResourceNSLink resource="events" name="Events" onClick={close} />
          </NavSection>

          <NavSection text="Workloads" icon="fa fa-folder-open-o">
            <ResourceNSLink resource="virtualmachines" name="Virtual Machines" onClick={close} />

            <ResourceNSLink resource="pods" name="Pods" onClick={close} />
            <ResourceNSLink resource="deployments" name="Deployments" onClick={close} />
            <ResourceNSLink resource="deploymentconfigs" name={DeploymentConfigModel.labelPlural} onClick={close} required={FLAGS.OPENSHIFT} />
            <ResourceNSLink resource="statefulsets" name="Stateful Sets" onClick={close} />
            <ResourceNSLink resource="secrets" name="Secrets" onClick={close} />
            <ResourceNSLink resource="configmaps" name="Config Maps" onClick={close} />
            <Sep />
            <ResourceNSLink resource="cronjobs" name="Cron Jobs" onClick={close} />
            <ResourceNSLink resource="jobs" name="Jobs" onClick={close} />
            <ResourceNSLink resource="daemonsets" name="Daemon Sets" onClick={close} />
            <ResourceNSLink resource="replicasets" name="Replica Sets" onClick={close} />
            <ResourceNSLink resource="replicationcontrollers" name="Replication Controllers" onClick={close} />
            <ResourceNSLink resource="horizontalpodautoscalers" name="HPAs" onClick={close} />
          </NavSection>

          <NavSection text="Networking" img={routingImg} activeImg={routingActiveImg} >
            <ResourceNSLink resource="services" name="Services" onClick={close} />
            <ResourceNSLink resource="routes" name="Routes" onClick={close} required={FLAGS.OPENSHIFT} />
            <ResourceNSLink resource="ingresses" name="Ingress" onClick={close} />
            <ResourceNSLink resource="networkpolicies" name="Network Policies" onClick={close} />
          </NavSection>

          <NavSection text="Storage" icon="pficon pficon-container-node">
            <ResourceClusterLink resource="persistentvolumes" name="Persistent Volumes" onClick={close} required={FLAGS.CAN_LIST_PV} />
            <ResourceNSLink resource="persistentvolumeclaims" name="Persistent Volume Claims" onClick={close} />
            <ResourceClusterLink resource="storageclasses" name="Storage Classes" onClick={close} required={FLAGS.CAN_LIST_STORE} />
          </NavSection>

          <MonitoringNavSection closeMenu={close} />

          <NavSection text="Administration" icon="fa fa-cog">
            <ResourceClusterLink resource="projects" name="Projects" onClick={close} required={FLAGS.OPENSHIFT} />
            <ResourceClusterLink resource="namespaces" name="Namespaces" onClick={close} required={FLAGS.CAN_LIST_NS} />
            <ResourceClusterLink resource="nodes" name="Nodes" onClick={close} required={FLAGS.CAN_LIST_NODE} />
            <HrefLink href="/settings/cluster" name="Cluster Settings" onClick={close} startsWith={clusterSettingsStartsWith} disallowed={FLAGS.OPENSHIFT} />
            <ResourceNSLink resource="serviceaccounts" name="Service Accounts" onClick={close} />
            <ResourceNSLink resource="roles" name="Roles" startsWith={rolesStartsWith} onClick={close} />
            <ResourceNSLink resource="rolebindings" name="Role Bindings" onClick={close} startsWith={rolebindingsStartsWith} />
            <ResourceNSLink resource="resourcequotas" name="Resource Quotas" onClick={close} startsWith={quotaStartsWith} />
            <ResourceNSLink resource="limitranges" name="Limit Ranges" onClick={close} />
            <ResourceNSLink resource={referenceForModel(ChargebackReportModel)} name="Chargeback" onClick={close} disallowed={FLAGS.OPENSHIFT} />
            <ResourceClusterLink resource="customresourcedefinitions" name="CRDs" onClick={close} required={FLAGS.CAN_LIST_CRD} />
          </NavSection>

          <UserNavSection closeMenu={close} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Nav;