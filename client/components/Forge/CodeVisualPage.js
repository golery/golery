import React from 'react';
import PropTypes from 'prop-types';

import styles from './CodeVisualPage.css';

export default class CodeVisualPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.component}>
            <div className={styles.idea}><b>Idea:</b> It's a cheatsheet. List of code snippet. Whenever user hover mouse
                over part of it, display a short description to remind
            </div>
            <br/><br/><br/><br/>
            <div>
                <div className={styles.hyperlink}>@SpringBootApplication</div>
                <br/>
                public class Demo2Application &#123;<br/>

                public static void main(String[] args) &#123;<br/>
                SpringApplication.run(Demo2Application.class, args);<br/>
                &#125;<br/>
                &#125;
            </div>
            <div className={styles.explain}>
                The <b>@SpringBootApplication</b> annotation tells Spring Boot, when launched, to
                scan recursively for Spring components inside this package and register
                them. It also tells Spring Boot to enable autoconfiguration, a process
                where beans are automatically created based on classpath settings, property
                settings, and other factors. We'll see more of this throughout the book.
                Finally, it indicates that this class itself can be a source for Spring bean
                definitions.<br/>
                (Learn Spring Boot 2.0)
            </div>
        </div>;
    }
}

CodeVisualPage.propTypes = {
    //node: PropTypes.object
};
