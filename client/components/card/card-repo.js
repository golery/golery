import DOMPurify from "dompurify";

import NodeRepo from "../../services/NodeRepo";

class Card {
    constructor(node, head, html) {
        this.head = head;
        this.html = html;
        this.node = node;
    }
}

class CardLoader {
    static _parseHtml(html) {
        let elmBody = document.createElement('div');
        let elmSrc = document.createElement('div');
        elmSrc.innerHTML = html;
        //console.log("*****", elmSrc.textContent, elmSrc);
        for (let i = 0; i < elmSrc.childNodes.length; i++) {
            if (i === 0) continue;
            let child = elmSrc.childNodes[i];
            //console.log('src', child);
            //console.log('clone', child.cloneNode(true));
            elmBody.appendChild(child.cloneNode(true));
        }

        //console.log("xxx", elmBody);
        return elmBody.innerHTML;
    }

    static _findNode(nodes, id) {
        for (let node of nodes) {
            if (node._id === id) {
                return node;
            }
        }
        return null;
    }

    createCards(nodes, rootNode) {
        let cards = [this.createCard(rootNode)];
        for (let child of rootNode.children) {
            let node = CardLoader._findNode(nodes, child);
            if (node !== null) {
                if (node.children && node.children.length > 0) {
                    let childCards = this.createCards(nodes, node);
                    cards = cards.concat(childCards);
                } else {
                    cards.push(this.createCard(node));
                }
            }
        }
        return cards;
    }

    createCard(node) {
        let html = DOMPurify.sanitize(node.html);
        let content = CardLoader._parseHtml(html);
        return new Card(node, node.name, content);
    }

    // example rootId. 57550b912c8eede6f1fc5fce
    load(rootId) {
        return NodeRepo.load(rootId).then(({nodes, rootNode}) => {
            return this.createCards(nodes, rootNode);
        })
    }
}

class CardRepo {
    constructor() {
        this.cards = null;
    }

    isLoaded() {
        return this.cards != null;
    }

    load(rootId) {
        return new CardLoader().load(rootId).then(cards => {
            this.cards = cards;
            this.shuffle();
        });
    }

    getSize() {
        return this.cards ? this.cards.length : 0;
    }

    shuffle() {
        if (!this.cards) return;
        let clone = this.cards.slice(0);
        for (let i = 0; i < clone.length / 2; i++) {
            let randomIndex = Math.floor(Math.random() * clone.length);
            let swap = clone[i];
            clone[i] = clone[randomIndex];
            clone[randomIndex] = swap;
        }
        this.cards = clone;
    }

    getCard(index) {
        if (this.cards == null || index < 0 || index >= this.cards.length) return null;
        return this.cards[index];
    }

    /** Find the index of card which nodeId is equal to the one in the parameter */
    findCardIndex(nodeId) {
        let cards = this.cards;
        if (!cards) return null;
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.node._id === nodeId) {
                console.log('Found card index ', i, ' for node', nodeId);
                return i;
            }
        }
        console.log('Node not found ', nodeId);
        return null;
    }
}

export {Card};
export default new CardRepo();
