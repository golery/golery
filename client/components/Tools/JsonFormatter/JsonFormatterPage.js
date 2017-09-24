import React from 'react';

import styles from './JsonFormatterPage.css';
import SampleJson from './SampleJson';
import format from './Format';

export default class JsonFormatterPage extends React.Component {
    constructor(props) {
        super(props);

        let sample = JSON.stringify(SampleJson);
        this.state = {compact: true, color: true};
        this.inputElm = null;
        this.input = sample;
    }

    componentDidMount() {

    }

    render() {
        return <div className={styles.component}>
            <div>
                <div className={styles.title}>JSON FORMATTER</div>

                <div className={styles.button} onClick={e => this._onFormat()}>Format</div>

                <div className={styles.options}>
                    <input type="checkbox"
                           checked={this.state.compact}
                           onChange={e => this.setState({compact: e.target.checked})}/>Compact
                </div>
                <pre className={styles.input} contentEditable onInput={e => this._onChangeInput()}
                     dangerouslySetInnerHTML={{__html: this.input}}
                     ref={ref => this.inputElm = ref}/>
            </div>
        </div>;
    }

    _onFormat() {
        let json = JSON.parse(this.input);
        this.input = format(json, {
            compact: this.state.compact,
            color: this.state.color
        });
        this.forceUpdate();
    }

    _onChangeInput() {
        if (!this.inputElm) return;
        this.input = this.inputElm.innerHTML;
    }
}

JsonFormatterPage.propTypes = {
    //options: PropTypes.array
};
