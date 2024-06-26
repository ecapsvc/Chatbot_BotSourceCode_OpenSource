import React, {
    useRef, useState, useContext, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { connect } from 'react-redux';
import {
    Button,
    Dropdown,
    Segment,
    Label,
    Icon,
    Message,
    Divider,
    Dimmer,
    Loader,
    Popup,
    Checkbox,
} from 'semantic-ui-react';
import { get as _get } from 'lodash';
import { NativeTypes } from 'react-dnd-html5-backend-cjs';
import { useDrop } from 'react-dnd-cjs';
import { StoryGroups } from '../../../api/storyGroups/storyGroups.collection';
import { Slots } from '../../../api/slots/slots.collection';
import { getDefaultDomainAndLanguage } from '../../../lib/story.utils';
import {
    useStoryFileReader,
    useDomainFileReader,
    useDatasetFileReader,
} from './fileReaders';
import {
    handleImportStoryGroups,
    handleImportDomain,
    handleImportDataset,
} from './fileImporters';
import { ProjectContext } from '../../layouts/context';

const ImportRasaFiles = (props) => {
    const {
        existingStoryGroups, existingSlots, projectId, defaultDomain,
    } = props;
    const { projectLanguages, instance, language } = useContext(ProjectContext);
    const [fallbackImportLanguage, setFallbackImportLanguage] = useState(language);
    const [wipeCurrent, setWipeCurrent] = useState({
        stories: false,
        domain: false,
        'NLU data': false,
    });

    const handleFileDrop = async (files, [fileList, setFileList]) => {
        const newValidFiles = Array.from(files).filter(
            f => f.size
                && !fileList.some(
                    // index on lastModified and filename
                    cf => cf.lastModified === f.lastModified && cf.filename === f.name,
                ),
        );
        setFileList({ add: newValidFiles });
    };

    const useFileDrop = fileReader => useDrop({
        accept: [NativeTypes.FILE],
        drop: item => handleFileDrop(item.files, fileReader),
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const renderFileList = ([fileList, setFileList]) => {
        const filesWithErrors = fileList.filter(f => (f.errors || []).length);
        const filesWithWarnings = fileList.filter(f => (f.warnings || []).length);
        const colorOfLabel = (f) => {
            if (f.errors && f.errors.length) return { color: 'red' };
            if (f.warnings && f.warnings.length) return { color: 'yellow' };
            return { color: 'green' };
        };
        return (
            <div>
                {fileList.map(f => (
                    <Label
                        key={`${f.filename}${f.lastModified}`}
                        className='file-label'
                        {...colorOfLabel(f)}
                        as='a'
                        onClick={e => e.stopPropagation()}
                    >
                        {f.name}
                        {f.name !== f.filename && (
                            <Label.Detail>({f.filename})</Label.Detail>
                        )}
                        <Icon
                            name='delete'
                            onClick={() => setFileList({
                                delete: {
                                    filename: f.filename,
                                    lastModified: f.lastModified,
                                },
                            })
                            }
                        />
                    </Label>
                ))}
                {(filesWithErrors.length > 0 || filesWithWarnings.length > 0) && (
                    <Divider />
                )}
                {filesWithErrors.length > 0 && (
                    <>
                        <h4>以下文件无法分析，将被忽略：</h4>
                        {filesWithErrors.map(f => (
                            <Message color='red' key={`errors-${f.name}`}>
                                <Message.Header>{f.name}</Message.Header>
                                <Message.List items={f.errors} />
                            </Message>
                        ))}
                    </>
                )}
                {filesWithWarnings.length > 0 && (
                    <>
                        <h4>以下文件具有与之关联的警告：</h4>
                        {filesWithWarnings.map(f => (
                            <Message color='yellow' key={`warnings-${f.name}`}>
                                <Message.Header>{f.name}</Message.Header>
                                <Message.List items={f.warnings} />
                            </Message>
                        ))}
                    </>
                )}
            </div>
        );
    };

    const renderImportSection = (params) => {
        const {
            title,
            fileReader,
            canDrop,
            isOver,
            drop,
            fileField,
            importingState,
            icon,
            tooltip,
        } = params;

        return (
            <Segment
                className={`import-box ${
                    canDrop && isOver && !importingState ? 'upload-target' : ''
                }`}
                key={`import-${title}`}
            >
                <div
                    {...(!importingState ? { ref: drop } : {})}
                    data-cy={`drop-zone-${title.replace(' ', '-').toLowerCase()}`}
                >
                    {importingState ? (
                        <Dimmer active inverted>
                            <Loader>{`Importing ${title}...`}</Loader>
                        </Dimmer>
                    ) : (
                        <>
                            <div className='side-by-side'>
                                <h3>
                                    {`Import ${title.replace(/^\w/, c => c.toUpperCase())}`}
                                </h3>
                                <div>
                                    <Popup
                                        content={tooltip}
                                        inverted
                                        trigger={(
                                            <Icon
                                                name='question circle'
                                                color='grey'
                                                size='large'
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <input
                                type='file'
                                ref={fileField}
                                style={{ display: 'none' }}
                                multiple
                                onChange={e => handleFileDrop(e.target.files, fileReader)
                                }
                            />
                            {fileReader[0].length ? (
                                renderFileList(fileReader)
                            ) : (
                                <>
                                    <div className='align-center'>
                                        <Icon
                                            name={icon}
                                            size='huge'
                                            color='grey'
                                            style={{ marginBottom: '8px' }}
                                        />
                                        <Button
                                            primary
                                            basic
                                            content={`Upload ${title}`}
                                            size='small'
                                            onClick={() => fileField.current.click()}
                                        />
                                        <span className='small grey'>
                                        或删除要上载的文件
                                        </span>
                                    </div>
                                </>
                            )}
                            <br />
                            <div className='side-by-side right'>
                                <Checkbox
                                    toggle
                                    checked={wipeCurrent[title]}
                                    onChange={() => setWipeCurrent({
                                        ...wipeCurrent,
                                        [title]: !wipeCurrent[title],
                                    })}
                                    label={`Replace existing ${title}`}
                                    data-cy={`wipe-${title.toLowerCase().replace(' ', '')}`}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Segment>
        );
    };

    const [storiesImporting, setStoriesImporting] = useState(false);
    const storyFileReader = useStoryFileReader(
        wipeCurrent.stories ? [] : existingStoryGroups,
    );
    useEffect(() => {
        // rerun add instruction to change storygroup name as needed
        if (typeof storyFileReader[1] === 'function') { storyFileReader[1]({ add: storyFileReader[0] }); }
    }, [wipeCurrent.stories]);
    const [dropStoryFilesIndicators, dropStoryFiles] = useFileDrop(storyFileReader);

    const [domainImporting, setDomainImporting] = useState(false);
    const domainFileReader = useDomainFileReader({
        defaultDomain,
        fallbackImportLanguage: fallbackImportLanguage || language,
        projectLanguages: projectLanguages.map(l => l.value),
    });
    const [dropDomainFilesIndicators, dropDomainFiles] = useFileDrop(domainFileReader);

    const [datasetImporting, setDatasetImporting] = useState(false);
    const datasetFileReader = useDatasetFileReader({
        instanceHost: instance.host,
        fallbackImportLanguage: fallbackImportLanguage || language,
        projectLanguages: projectLanguages.map(l => l.value),
    });
    const [dropDatasetFilesIndicators, dropDatasetFiles] = useFileDrop(datasetFileReader);

    const importers = [
        {
            title: 'stories',
            fileReader: storyFileReader,
            ...dropStoryFilesIndicators,
            drop: dropStoryFiles,
            fileField: useRef(),
            onImport: handleImportStoryGroups,
            importingState: storiesImporting,
            setImportingState: setStoriesImporting,
            icon: 'book',
            tooltip: (
                <p>
                    导入场景，每个文件一个场景组。&apos;现有场景组的内容永远不会被覆盖。
                </p>
            ),
        },
        {
            title: 'domain',
            fileReader: domainFileReader,
            ...dropDomainFilesIndicators,
            drop: dropDomainFiles,
            fileField: useRef(),
            onImport: handleImportDomain,
            importingState: domainImporting,
            setImportingState: setDomainImporting,
            icon: 'globe',
            tooltip: (
                <>
                    <p>
                    导入槽和机器人响应。现有的插槽和响应将被完全覆盖。&apos;不会导入当前默认域中的插槽。
                    </p>

                    <p>
                    当前未导入表单和操作。如果你的行为和形式&apos;在故事中被提及，它们会在训练中自动推断出来。
                    </p>

                    <p>更多信息，请阅读文档。</p>
                </>
            ),
        },
        {
            title: 'NLU data',
            fileReader: datasetFileReader,
            ...dropDatasetFilesIndicators,
            drop: dropDatasetFiles,
            fileField: useRef(),
            onImport: handleImportDataset,
            importingState: datasetImporting,
            setImportingState: setDatasetImporting,
            icon: 'grid layout',
            tooltip: (
                <>
                    <p>
                    输入NLU的例子，同义词和宪报，项目将添加到当前集合中。
                    </p>
                </>
            ),
        },
    ];
    const valid = (reader, filter = () => true) => reader[0].filter(f => !f.errors && filter(f));

    const handleImport = () => {
        importers.forEach(({
            fileReader, onImport, setImportingState, title,
        }) => onImport(valid(fileReader), {
            projectId,
            fileReader,
            setImportingState,
            wipeCurrent: wipeCurrent[title],
            existingStoryGroups,
            existingSlots,
        }));
    };

    const renderTotals = () => {
        const countAcrossFiles = (reader, path, filter = () => true) => valid(reader, filter).reduce(
            (acc, curr) => acc + _get(curr, path, []).length,
            0,
        );
        const numbers = {
            story: countAcrossFiles(storyFileReader, 'parsedStories'),
            slot: countAcrossFiles(domainFileReader, 'slots'),
            form: countAcrossFiles(domainFileReader, 'bfForms'),
            response: countAcrossFiles(domainFileReader, 'responses'),
        };
        projectLanguages.forEach((l) => {
            numbers[`${l.text} example`] = countAcrossFiles(
                datasetFileReader,
                'rasa_nlu_data.common_examples',
                f => f.language === l.value,
            );
            numbers[`${l.text} synonym`] = countAcrossFiles(
                datasetFileReader,
                'rasa_nlu_data.entity_synonyms',
                f => f.language === l.value,
            );
            numbers[`${l.text} gazette`] = countAcrossFiles(
                datasetFileReader,
                'rasa_nlu_data.gazette',
                f => f.language === l.value,
            );
            numbers[`${l.text} regex_feature`] = countAcrossFiles(
                datasetFileReader,
                'rasa_nlu_data.regex_features',
                f => f.language === l.value,
            );
        });

        const pluralizeUnit = unit => (unit.slice(-1) === 'y' ? `${unit.slice(0, -1)}ies` : `${unit}s`);
        const printCount = (number, unit) => (number ? `${number} ${number < 2 ? unit : pluralizeUnit(unit)}` : null);
        return Object.keys(numbers)
            .map(n => printCount(numbers[n], n))
            .filter(c => c)
            .join(', ');
    };

    const counts = useMemo(renderTotals, importers);

    const renderBottom = () => {
        if (!counts) return null;
        return (
            <Message info>
                <div>Importing {counts}.</div>
                <div className='side-by-side middle'>
                    <div className='side-by-side narrow left middle'>
                        <Popup
                            content={(
                                <>
                                    <p>
                                        在域文件中找到的Bot响应将使用language属性（如果存在）；&apos;如果不存在，则将使用回退导入语言。
                                    </p>

                                    <p>
                                    同样，NLU文件的语言可以在其第一行中指定；如果不是，则将使用回写导入语言。
                                    </p>

                                    <p>更多信息，请阅读文档。</p>
                                </>
                            )}
                            inverted
                            trigger={(
                                <div>
                                    <Icon name='question circle' />
                                    <strong>回退导入语言： </strong>
                                </div>
                            )}
                        />
                        <Dropdown
                            className='export-option'
                            options={projectLanguages}
                            selection
                            value={fallbackImportLanguage}
                            onChange={(_e, { value }) => {
                                importers.forEach(i => i.fileReader[1]({ changeLang: value }));
                                setFallbackImportLanguage(value);
                            }}
                        />
                    </div>
                    <div>
                        <Button content='Import' data-cy='import-rasa-files' primary onClick={handleImport} />
                    </div>
                </div>
            </Message>
        );
    };

    return (
        <>
            {importers.map(renderImportSection)}
            {renderBottom()}
        </>
    );
};

ImportRasaFiles.propTypes = {
    projectId: PropTypes.string.isRequired,
    existingStoryGroups: PropTypes.array.isRequired,
    existingSlots: PropTypes.array.isRequired,
    defaultDomain: PropTypes.object.isRequired,
};

ImportRasaFiles.defaultProps = {};

const ImportRasaFilesContainer = withTracker(({ projectId }) => {
    const storyGroupHandler = Meteor.subscribe('storiesGroup', projectId);
    const slotsHandler = Meteor.subscribe('slots', projectId);
    const existingStoryGroups = storyGroupHandler.ready()
        ? StoryGroups.find({ projectId }).fetch()
        : [];
    const existingSlots = slotsHandler.ready() ? Slots.find({ projectId }).fetch() : [];
    const { defaultDomain } = getDefaultDomainAndLanguage(projectId);
    return { existingStoryGroups, existingSlots, defaultDomain };
})(ImportRasaFiles);

const mapStateToProps = state => ({
    projectId: state.settings.get('projectId'),
});

export default connect(mapStateToProps)(ImportRasaFilesContainer);
