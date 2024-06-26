/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { AutoForm, SubmitField, ErrorsField } from 'uniforms-semantic';
import { Dropdown, Form, Message } from 'semantic-ui-react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { ProjectsSchema } from '../../../api/project/project.schema';
import { ProjectContext } from '../../layouts/context';
import InfoField from '../utils/InfoField';
import { wrapMeteorCallback } from '../utils/Errors';
import SelectField from '../form_fields/SelectField';
import { languages } from '../../../lib/languages';

class ProjectInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            value: [],
            model: {},
        };
    }

    componentDidMount() {
        const { projectLanguages, project } = this.context;
        this.setState({ value: projectLanguages.map(l => l.value) });
        this.setState({ model: project });
    }

    getOptions = () => {
        const renderOptions = Object.keys(languages).map(code => ({
            text: languages[code].name,
            key: code,
            value: code,
        }));
        return renderOptions;
    };

    renderLabel = (language) => {
        const { projectLanguages } = this.context;
        const isModelExist = projectLanguages.some(l => l.value === language.value);
        const label = {
            color: isModelExist ? 'blue' : 'green',
            content: `${language.text}`,
        };
        if (!isModelExist) return label;
        label.removeIcon = '';
        return label;
    };

    onChange = (e, { value: newValue }) => {
        this.setState({ saving: false, value: newValue });
    };

    createNLUModels = (languageArray, projectId) => {
        const nluInsertArray = languageArray.map(language => Meteor.callWithPromise(
            'nlu.insert',
            projectId,
            language,
        ));
        Promise.all(nluInsertArray).then(() => {
            this.setState({ saving: false });
        });
    };

    onSave = (project) => {
        const { value } = this.state;
        const { projectLanguages } = this.context;
        const { name, _id, defaultLanguage } = project;
        const notInprojectLanguages = value.filter(el => !projectLanguages.some(l => l.value === el));
        this.setState({ saving: true });
        Meteor.call(
            'project.update',
            { name, _id, defaultLanguage },
            wrapMeteorCallback((err) => {
                if (!err) {
                    this.createNLUModels(
                        notInprojectLanguages,
                        _id,
                    );
                }
            }, 'Changes saved'),
        );
    };

    renderDeleteprojectLanguages = () => (
        <Message
            size='tiny'
            info
            content={(
                <>
                    若要从项目中删除语言，请转到{' '}
                    <strong> 语义理解 &gt; 设置 &gt; 删除 </strong>.
                </>
            )}
        />
    );

    static contextType = ProjectContext;

    render() {
        const { projectLanguages } = this.context;
        const { saving, value, model } = this.state;
        const bridge = new SimpleSchema2Bridge(ProjectsSchema);
        return (
            <>
                <AutoForm
                    schema={bridge}
                    model={model}
                    onSubmit={updateProject => this.onSave(updateProject)}
                    disabled={saving}
                >
                    <InfoField
                        name='name'
                        label='Name'
                        className='project-name'
                    />
                    <Form.Field>
                        <label>支持的语言</label>
                        <Dropdown
                            label='选择语言'
                            name='lang'
                            placeholder='添加语言'
                            multiple
                            search
                            value={value}
                            selection
                            onChange={this.onChange}
                            options={this.getOptions()}
                            renderLabel={language => this.renderLabel(
                                language,
                            )}
                            data-cy='language-selector'
                        />
                        {!!projectLanguages.length
                                && this.renderDeleteprojectLanguages()}
                    </Form.Field>
                    {!!projectLanguages.length && (
                        <SelectField
                            name='defaultLanguage'
                            options={projectLanguages}
                            className='project-default-language'
                            data-cy='default-langauge-selection'
                        />
                    )}
                    <br />
                    <ErrorsField />
                    <SubmitField
                        className='primary save-project-info-button'
                        value='保存修改'
                        data-cy='save-changes'
                    />
                </AutoForm>
            </>
        );
    }
}

ProjectInfo.propTypes = {};

export default ProjectInfo;
