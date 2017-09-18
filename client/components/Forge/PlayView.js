import React from 'react';
import Mousetrap  from 'mousetrap';

import styles from './PlayView.css';
export default class PlayView extends React.Component {
    constructor(props) {
        super(props);

        this._onNext = this._onNext.bind(this);
        this._onPrevious = this._onPrevious.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
        this.images = ["http://i.imgur.com/I84s2lq.jpg", "http://i.imgur.com/DCJmNw5.jpg", "http://i.imgur.com/flLGMdh.jpg", "http://i.imgur.com/7IRPtjy.jpg"];
        this.state = {index: 0};
    }

    componentDidMount() {
        Mousetrap.bind('left', this._onPrevious);
        Mousetrap.bind('right', this._onNext);

        toggleFullScreen();

        function toggleFullScreen() {
            let el = document.documentElement,
                rfs = el.requestFullscreen
                    || el.webkitRequestFullScreen
                    || el.mozRequestFullScreen
                    || el.msRequestFullscreen;

            rfs.call(el);
        }
    }

    componentWillUnmount() {
        Mousetrap.unbind('left', this._onPrevious);
        Mousetrap.unbind('right', this._onNext);
    }

    render() {
        return <div className={styles.component}>
            <img src={this.images[this.state.index]} className={styles.image}/>
            <div className={styles.buttonNext} onClick={this._onNext}>&gt;</div>
            <div className={styles.buttonPrevious} onClick={this._onPrevious}>&lt;</div>
        </div>;
    }

    _onNext() {
        this.setState({index: (this.state.index + 1) % this.images.length});
    }

    _onPrevious() {
        this.setState({index: (this.state.index - 1 + this.images.length) % this.images.length});
    }
}
