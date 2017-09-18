import React from "react";
import {hashHistory} from "react-router-dom";
import Swipeable from "react-swipeable";
// -- Styles --
import styles from "./card.css";
// -- Libs --
import CardRepo from "./card-repo";

export default class CardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {index: 0};

        this._createCards();
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onSwipeLeft = this.onSwipeLeft.bind(this);
        this.onSwipeRight = this.onSwipeRight.bind(this);
    }

    _createCards() {
        let rootId = this.props.match.params.rootId;
        if (CardRepo.isLoaded()) {
            this._initIndex(this.props.match.params.nodeId);
        } else {
            CardRepo.load(rootId).then(() => {
                this._initIndex(this.props.match.params.nodeId);
            });
        }
    }

    _initIndex(nodeId) {
        let cardIndex = 0;
        if (nodeId) {
            cardIndex = CardRepo.findCardIndex(nodeId);
        }
        this.setState({index: cardIndex});
    }

    _goTo(direction) {
        let index = (this.state.index + direction + CardRepo.getSize()) % CardRepo.getSize();
        let card = CardRepo.getCard(index);

        const rootId = this.props.match.params.rootId;
        const nodeId = card.node._id;
        this.props.history.push(`/card/${rootId}/${nodeId}`);
        this.setState({index: index});
    }

    _goPrev(e) {
        this._goTo(+1);
    }

    _goNext(e) {
        this._goTo(-1);
    }

    onSwipeLeft(e) {
        this._goPrev(e);
    }

    onSwipeRight(e) {
        this._goNext(e);
    }

    onKeyDown(e) {
        const LEFT = 37;
        const RIGHT = 39;
        let key = e.keyCode;
        let process = true;
        if (key === LEFT) {
            this._goNext(e);
        }
        if (key === RIGHT) {
            this._goPrev(e);
        } else {
            process = false;
        }
        if (process) e.preventDefault();
    }

    _onClickNext() {
        alert('Use arrow or swipe screen to move to next/prev card');
    }

    _onClickAdd(e) {
        e.preventDefault();
        this.props.history.push('/card/add');
    }

    render() {
        let card = CardRepo.getCard(this.state.index);
        if (!card) return <div>Loading...</div>;

        let rootId = this.props.match.params.rootId;
        console.log('Show card or node ', card.node, rootId);

        return <Swipeable onSwipedLeft={this.onSwipeLeft} onSwipedRight={this.onSwipeRight} trackMouse={true}>
            <div className={styles.card} onKeyDown={this.onKeyDown} tabIndex="1"
                 ref={elmCard => elmCard && elmCard.focus()}>
                <div className={styles.content}>
                    <div className={styles.head1}>{card.head}</div>
                    <div>
                        <div className={styles.separator}></div>
                    </div>
                    <div className={styles.head2}>
                        <div dangerouslySetInnerHTML={{__html: card.html}}/>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.actionButtonHolder}>
                        <a href="#" onClick={(e) => this._onClickAdd(e)}>Add</a>
                    </div>
                    <div className={styles.tags}>#vocab</div>
                </div>
            </div>
        </Swipeable>;
        //<Link to={{pathName:`/edit/${this.state.card.node._id}/`, query:{rootId:this.props.rootId}}} className={styles.buttonEdit1}>Edit</Link>
    }
}
