import React from 'react';

interface MicroProps {
    contentPromise: Promise < Blob >;
    contentSource: string;
    contentURL: string;
    elementStyles: Array < ElementStyle >;
    iframeClassName: string;
    iframeStyle: string;
    iframeTitle: string;
    rootClassName: string;
    rootStyle: object;
    shouldLog: boolean;
    type: string;
}

interface ElementStyle {
    id : string;
    style : string;
}

interface MicroState {
    shouldRender : boolean;
}

const UNIQUE_ID = Math
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

    fetchContentBySource = (source : string) => {
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

    fetchContentViaURL = (contentURL : string) => {}

    setContent = (content : any) => {
        const DATA_URL = URL.createObjectURL(content);
        const IFRAME : HTMLIFrameElement = document.getElementById(`frame_${UNIQUE_ID}`)as HTMLIFrameElement;

        if (IFRAME) {
            IFRAME.src = DATA_URL
        }

        setTimeout(() => {
            this.setStyles();
        }, 300);
    }

    setStyles = () => {
        this.styleContent(this.props.elementStyles);
        this.setIframeStyle(this.props.iframeStyle);
    }

    styleContent = (styles : Array < ElementStyle >) => {
        if (!styles || styles.length === 0) {
            return;
        }

        const IFRAME : HTMLIFrameElement = document.getElementById(`frame_${UNIQUE_ID}`)as HTMLIFrameElement;

        if (IFRAME) {
            styles.forEach(el => {
                let $ = IFRAME
                    .contentDocument
                    .getElementById(el.id);
                if ($) {
                    $.style.cssText += `; ${el.style}`;
                }
            });
        }
    }

    setIframeStyle = (iframeStyle : string) => {
        let IFRAME : HTMLIFrameElement = document.getElementById(`frame_${UNIQUE_ID}`) as HTMLIFrameElement;
        if (IFRAME) {
            IFRAME.contentDocument.body.style.margin = '0';
            IFRAME.style.visibility = 'visible';
            IFRAME.style.cssText += `; ${iframeStyle}`;
        }
    }

    renderContent = (settings : MicroProps) => {
        let {iframeClassName, iframeTitle} = settings;

        return (
            <iframe
                id={`frame_${UNIQUE_ID}`}
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