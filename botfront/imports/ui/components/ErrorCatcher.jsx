import React from 'react';
import { Link } from 'react-router';
import { Container, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import CrashReportButton from './utils/CrashReportButton';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, reported: false };
    }

    componentDidCatch(...error) {
        this.setState({ error });
    }

    renderError = () => {
        const { error, reported } = this.state;
        const {
            children: { props: { location: { pathname = '' } = {} } = {} } = {},
        } = this.props;
        return (
            <Container style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <div>
                    <Header
                        as='h1'
                        style={{ fontFamily: 'Hind, sans-serif', fontSize: '160px' }}
                    >
                        Oops!
                        <Header.Subheader style={{ marginTop: '10px' }}>
                            Something went wrong. Sorry about that.
                        </Header.Subheader>
                    </Header>
                    <p>
                        {reported
                            ? 'We\'re working on it!'
                            : 'Help the Botfront project by reporting the issue.'}
                    </p>
                    <p>
                        <CrashReportButton
                            pathname={pathname}
                            error={error}
                            reported={reported}
                            onLoad={rep => this.setState({ reported: rep })}
                        />
                    </p>
                    <Link to='/'>&#8617; home</Link>
                </div>
            </Container>
        );
    };

    render() {
        const { error } = this.state;
        const { children } = this.props;
        if (error) return this.renderError();
        return children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.any.isRequired,
};
