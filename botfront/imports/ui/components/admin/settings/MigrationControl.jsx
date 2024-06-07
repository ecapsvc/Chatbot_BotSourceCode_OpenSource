import React, { useState, useEffect } from 'react';
import {
    Header, Button, Confirm, Message,
} from 'semantic-ui-react';
import { useMethod } from '../../../../lib/utils';
import { can } from '../../../../lib/scopes';

const MigrationControl = () => {
    const { data: migrationDb, call: getMigrationStatus } = useMethod('settings.getMigrationStatus');
    const { call: unlockMigration } = useMethod('settings.unlockMigration');

    useEffect(() => {
        getMigrationStatus();
    }, []);

    const [LocalMigration, setLocalMigration] = useState(null);
    const [displayUnlockMessage, setDisplayUnlockMessage] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const migration = LocalMigration || migrationDb;
    return (
        <>
            {migration && can('global-admin') && (
            <>
                <Header>迁移控制</Header>
                <p data-cy='migration-version'>当前版本： {migration.version}</p>
                <p data-cy='migration-latest-version'>最新版本：{migration.latest}</p>
                <p data-cy='migration-status'>状态： {migration.locked ? 'Locked' : 'OK'}</p>
                {migration.locked && (
                    <>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setConfirmModalOpen(true);
                            }}
                            primary
                        >
                        解除迁移锁定
                        </Button>
                        <Confirm
                            open={confirmModalOpen}
                            header='Unlock migration control'
                            content='确定要继续吗？'
                            onConfirm={() => {
                                unlockMigration();
                                setLocalMigration({ ...migration, locked: !migration.locked });
                                setDisplayUnlockMessage(true);
                            }}
                            onCancel={() => setConfirmModalOpen(false)}
                        />
                    </>
                )}
                {!migration.locked && displayUnlockMessage && (
                    <Message positive>
                        <Message.Header>迁移控制已解锁</Message.Header>
                        重新启动Botfront以恢复迁移。
                    </Message>
                )}
            </>
            )}
        </>
    );
};

MigrationControl.propTypes = {
};

export default MigrationControl;
