import React from 'react';

interface ElementStyle {
    id : string;
    style : string;
}

interface MicroProps {
    contentPromise : Promise < Blob >;
    contentSource : string;
    contentURL : string;
    elementStyles : Array < ElementStyle >;
    iframeClassName : string;
    iframeStyle : string;
    iframeTitle : string;
    rootClassName : string;
    rootStyle : object;
    shouldLog : boolean;
    type : string;
}

interface MicroState {
    shouldRender : boolean;
}

const UNIQUE_ID : string = Math
    .random()
    .toString(36)
    .substr(2, 5) + '_' + new Date().getTime();

export default class Micro extends React.PureComponent < MicroProps,
MicroState > {
    public static defaultProps : Partial < MicroProps > = {
        contentSource: 'promise',
        elementStyles: [],
        iframeClassName: '',
        iframeStyle: `
            border: none;
            padding: 0;
            margin: 0;
        `,
        iframeTitle: 'react-micro-iframe-' + UNIQUE_ID,
        rootClassName: '',
        rootStyle: {},
        shouldLog: true,
        type: 'iframe'
    }

    constructor(props : MicroProps) {
        super(props);
        this.state = {
            shouldRender: false
        };
    }

    componentDidMount() {
        this.fetchContentBySource(this.props.contentSource);
    }

    fetchContentBySource = (source : string) : void => {
        switch (source) {
            case 'promise':
                this.fetchContentViaPromise(this.props.contentPromise);
                break;

            case 'url':
                this.fetchContentViaURL(this.props.contentURL);
                break;

            default:
                break;
        }
    }

    fetchContentViaPromise = async(contentPromise : Promise < Blob >) => {
        let p : any;

        try {
            p = await contentPromise;
        } catch (err) {
            if (this.props.shouldLog) {
                console.error("react-micro : ", err);
            }
        }

        if (p && p.data && p.data.size > 0) {
            this.setState({
                shouldRender: true
            }, () => {
                this.setContent(p.data);
            });
        }
    }

    fetchContentViaURL = (contentURL : string) => {
        // TODO
    }

    setContent = (content : any) : void => {
        if (!content) {
            return;
        }

        const $iframe : HTMLIFrameElement = document.getElementById(`frame_${UNIQUE_ID}`)as HTMLIFrameElement;
        if (!$iframe) {
            return;
        }

        const reader : FileReader = new FileReader();
        reader.addEventListener('loadend', (e : any) => {
            const HTML : string = e.srcElement
                ? e.srcElement.result
                : '';

            let doc : Document | null = $iframe.contentWindow
                ? $iframe.contentWindow.document
                : null;

            if (doc) {
                doc.open();
                doc.write(HTML);
                doc.close();

                this.setStyles();
            }
        });

        reader.readAsText(content);
    }

    setStyles = () : void => {
        this.styleContent(this.props.elementStyles);
        this.setIframeStyle(this.props.iframeStyle);
    }

    styleContent = (styles : Array < ElementStyle >) : void => {
        if (!styles || styles.length === 0) {
            return;
        }

        const $iframe : HTMLIFrameElement = document.getElementById(`frame_${UNIQUE_ID}`)as HTMLIFrameElement;
        if ($iframe) {
            styles.forEach((el : ElementStyle) => {
                let $ : HTMLElement | null = $iframe.contentDocument
                    ? $iframe
                        .contentDocument
                        .getElementById(el.id)
                    : null;
                if ($) {
                    $.style.cssText += `; ${el.style}`;
                }
            });
        }
    }

    setIframeStyle = (iframeStyle : string) : void => {
        const $iframe : HTMLIFrameElement = document.getElementById(`frame_${UNIQUE_ID}`)as HTMLIFrameElement;
        if (!$iframe) {
            return;
        }

        $iframe.style.visibility = 'visible';
        $iframe.style.cssText += `; ${iframeStyle}`;

        if ($iframe.contentDocument) {
            $iframe.contentDocument.body.style.margin = '0';
        }
    }

    renderContent = (settings : MicroProps) : JSX.Element => {
        const {iframeClassName, iframeTitle} = settings;

        return (
            <iframe
                id={`frame_${UNIQUE_ID}`}
                scrolling="no"
                frameBorder="0"
                title={iframeTitle}
                className={`ReactMicro__Frame ${iframeClassName}`}
                style={{
                visibility: 'hidden'
            }}></iframe>
        );
    }

    render() {
        if (!this.state.shouldRender) {
            return null;
        }

        let {rootClassName, rootStyle} = this.props;

        return (
            <span className={`ReactMicro ${rootClassName}`} style={rootStyle}>
                {this.renderContent(this.props)}
            </span>
        );
    }
}
