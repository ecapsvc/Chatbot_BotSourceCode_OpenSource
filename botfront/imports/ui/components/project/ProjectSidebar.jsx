/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { Menu, Divider } from 'semantic-ui-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Can } from '../../../lib/scopes';
import { Projects } from '../../../api/project/project.collection';
import ProjectsDropdown from './ProjectsDropdown';
import { GlobalSettings } from '../../../api/globalSettings/globalSettings.collection';

const packageJson = require('/package.json');

class ProjectSidebar extends React.Component {
    render() {
        const {
            projectName, projectId, handleChangeProject, settingsReady, settings,
        } = this.props;

        return (
            <DocumentTitle title={projectName}>
                <Menu vertical inverted pointing className='project-menu'>
                    <Menu.Item>
                        <Menu.Header style={{ marginBottom: '20px' }}>选择机器人</Menu.Header>
                        <ProjectsDropdown currentProjectId={projectId} onProjectChange={handleChangeProject} />
                    </Menu.Item>
                    <Link to={`/project/${projectId}/dialogue`}>
                        <Menu.Item name='对话' icon='book' data-cy='dialogue-sidebar-link' />
                    </Link>
                    <Link to={`/project/${projectId}/nlu/models`}>
                        <Menu.Item name='语义理解' icon='grid layout' data-cy='nlu-sidebar-link' />
                    </Link>
                    <Link to={`/project/${projectId}/incoming`}>
                        <Menu.Item name='意图识别' icon='inbox' data-cy='incoming-sidebar-link' />
                    </Link>
                    <Link to={`/project/${projectId}/responses`}>
                        <Menu.Item name='对话响应' icon='comment' />
                    </Link>
                    <Link to={`/project/${projectId}/settings`}>
                        <Menu.Item name='设置' icon='setting' />
                    </Link>
                    {/* <a href={settingsReady ? settings.settings.public.docUrl : ''} target='_blank' rel='noopener noreferrer'>
                        <Menu.Item name='文档' icon='question' />
                    </a>
                    <a href={settingsReady ? 'https://spectrum.chat/botfront' : ''} target='_blank' rel='noopener noreferrer'>
                        <Menu.Item name='帮助' icon='bell' content='Get help' />
                    </a> */}
                    <Divider inverted />
                    <Link to='/login'>
                        <Menu.Item data-cy='signout' name='退出系统' icon='sign-out' />
                    </Link>
                    <span className='force-bottom'>{packageJson.version}</span>
                </Menu>
            </DocumentTitle>
        );
    }
}

ProjectSidebar.propTypes = {
    projectId: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    handleChangeProject: PropTypes.func.isRequired,
    settingsReady: PropTypes.bool.isRequired,
    settings: PropTypes.object,
};

ProjectSidebar.defaultProps = {
    settings: null,
};

const ProjectSidebarContainer = withTracker((props) => {
    const { projectId } = props;
    const settingsHandler = Meteor.subscribe('settings');
    const settings = GlobalSettings.findOne({}, { fields: { 'settings.public.docUrl': 1 } });
    const currentProject = Projects.find({ _id: projectId }).fetch();
    const projectName = currentProject.length > 0 ? `${currentProject[0].name}` : 'Botfront.';

    return {
        projectName,
        settingsReady: settingsHandler.ready(),
        settings,
    };
})(ProjectSidebar);

export default ProjectSidebarContainer;
