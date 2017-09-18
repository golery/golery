import React from 'react';

import styles from './PlanPage.css';
import Modal from '../Core/Dialog/Modal';
import EditPage from './EditPay';


export default class PlanPage extends React.Component {
    constructor(props) {
        super(props);
        this.onSaveEdit = this.onSaveEdit.bind(this);
        this.onClick = this.onClick.bind(this);

        let payments = [
            {from: 'Nuria G.', to: 'Elsa', amount: 10, currency: 'CHF', paid: true},
            {from: 'Cesla-Yves M.', to: 'Elsa', amount: 12.5, currency: 'CHF', paid: false},
            {from: 'Joana A.', to: 'Elsa', amount: 8.5, currency: 'CHF', paid: true}
        ];
        this.state = {payments: payments, isEditing: false};
    }

    onSaveEdit(from, to, amount) {
        let newPayments = this.state.payments.concat([{from: from, to: to, amount: amount, currency: 'CHF'}]);
        this.setState({payments: newPayments, isEditing: false});
    }

    onClick() {
        this.setState({isEditing: true});
    }

    render() {
        let elmHeader = <div className={styles.tableRow + ' ' + styles.tableHead}>
            <div className={styles.tableCol1}>From</div>
            <div className={styles.tableCol2}>To</div>
            <div className={styles.tableCol3}>Amount</div>
            <div className={styles.tableCol4}>Paid</div>
        </div>;
        let elmList = this.state.payments.map((v, index) => {
            let elmPay = v.paid ?
                <span className={styles.paidButton}>Paid</span> :
                <span className={styles.notPaidButton}>Not paid</span>;
            return <div key={index} className={styles.tableRow}>
                <div className={styles.tableCol1}>{v.from}</div>
                <div className={styles.tableCol2}>{v.to}</div>
                <div className={styles.tableCol3}>{v.amount} {v.currency}</div>
                <div className={styles.tableCol4}>{elmPay}</div>
            </div>
        });
        let description = 'Elsa bought a new pizza cooker. Let\'s party !';
        return <div className={styles.component}>
            <div className={styles.eventHolder}>
                <span className={styles.eventId}>Tasty Pizza + Dota night !</span>
            </div>
            <div className={styles.date}>1-Jun, at Elsa place (52 Rue de la Gare, Echallens)</div>
            <div>&nbsp;</div>
            <div>{description}</div>
            <div className={styles.table}>
                {elmHeader}
                <div className={styles.tableBody}>
                {elmList}
                </div>
            </div>
            <div className={styles.button}
                 onClick={() => this.onClick()}>Add
            </div>
            <div>
                <input type="checkbox"/> Send email reminder for payment on Saturday night
            </div>
            <Modal isOpen={this.state.isEditing} onClose={() => this.setState({isEditing: false})}>
                <EditPage onSave={this.onSaveEdit}/>
            </Modal>
        </div>;
    }
}
