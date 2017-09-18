import textversionjs from 'textversionjs';

class HeadLineParser {
    parseTitle(content) {
        if (!content) {
            return "";
        }
        let text = content.trim();
        text = HeadLineParser._getFirstLine(text);
        text = text.trim();
        if (text.length == 0) {
            text = '<empty>';
        }
        return text;
    }

    static _getFirstLine(html) {
        // remove all empty div
        // ex: <div><p> </div></b>
        let r1 = /^((\s*)<[^<]*?>(\s*))*/;
        let m1 = r1.exec(html);
        let start = m1[0].length;
        html = html.substring(start);

        // find next new-line tag:
        // <div> or </div> or <p> or <br> or endstring $
        // /m: multiple line
        let r2 = /^(.*?)((<(\/?)(div|p|br|ul|ol|hr|li)([^>]*)>)|$)/m;
        let m2 = r2.exec(html);
        let end = m2[0].length;
        let firstLine = html.substring(0, end);
        return HeadLineParser._htmlToText(firstLine);
    }

    static _htmlToText(html) {
        return textversionjs(html);
    }
}
export default new HeadLineParser();
