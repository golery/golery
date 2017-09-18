import React from 'react';

import styles from './JsonFormatterPage.css';
import SampleJson from './SampleJson';
import format from './Format';

export default class JsonFormatterPage extends React.Component {
    constructor(props) {
        super(props);

        let sample = JSON.stringify(SampleJson);
        this.state = {input: sample, compact: true, color: true};
    }

    componentDidMount() {

    }

    render() {
        let json = this.state.input;
        return <div className={styles.component}>
            <div>
                <div className={styles.title}>JSON FORMATTER</div>

                <div className={styles.button} onClick={e => this._onFormat()}>Format</div>

                <div className={styles.options}>
                    <input type="checkbox"
                           checked={this.state.compact}
                           onChange={e => this.setState({compact: e.target.checked})}/>Compact
                </div>
                <pre className={styles.input} contentEditable>{json}</pre>
            </div>
        </div>;
    }

    _onFormat() {
        let json = JSON.parse(this.state.input);
        let s = format(json, {
            compact: this.state.compact,
            color: this.state.color
        });
        this.setState({input: s});
    }
}

JsonFormatterPage.propTypes = {
    //options: PropTypes.array
};
