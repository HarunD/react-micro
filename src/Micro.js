import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

const UNIQUE_ID = Math
    .random()
    .toString(36)
    .substr(2, 5) + '_' + new Date().getTime()

export default class Micro extends PureComponent {
    state = {
        shouldRender: false
    }

    componentDidMount() {
        switch (this.props.contentSource) {
            case 'promise':
                this.fetchContentFromPromise(this.props.contentPromise);
                break;

            case 'url':
                this.fetchContentWithURL(this.props.contentURL);
                break;

            default:
                break;
        }
    }

    fetchContentFromPromise = async contentPromise => {
        let p

        try {
            p = await contentPromise
        } catch (err) {
            if (this.state.shouldLog) {
                console.error("react-micro : ", err)
            }
        }

        if (p && p.data && p.data.size > 0) {
            this.setState({
                shouldRender: true
            }, () => {
                this.setContent(p.data)
            })
        }
    }

    fetchContentWithURL = () => {}

    setContent = content => {
        const DATA_URL = URL.createObjectURL(content)
        document
            .getElementById(`frame_${UNIQUE_ID}`)
            .src = DATA_URL

        setTimeout(() => {
            this.setStyles()
        }, 300)
    }

    setStyles = () => {
        this.styleContent(this.props.elementStyles)
        this.setIframeStyle(this.props.iframeStyle)
    }

    // Style elements inside the iframe based on the provided
    // element_id=>element_style pairs
    styleContent = styles => {
        if (!styles || styles.length === 0) {
            return
        }

        const RE = document.getElementById(`frame_${UNIQUE_ID}`)

        styles.forEach(el => {
            let $ = RE
                .contentDocument
                .getElementById(el.id)
            if ($) {
                $.style.cssText += `; ${el.style}`
            }
        })
    }

    setIframeStyle = iframeStyle => {
        let I = document.getElementById(`frame_${UNIQUE_ID}`)
        I.contentDocument.body.style.margin = 0
        I.style.visibility = 'visible'
        I.style.cssText += `; ${iframeStyle}`
    }

    renderContent = settings => {
        let {iframeClassName, iframeTitle} = settings

        return (
            <iframe
                id={`frame_${UNIQUE_ID}`}
                title={iframeTitle}
                className={`ReactMicro__Frame ${iframeClassName}`}
                style={{
                visibility: 'hidden'
            }}></iframe>
        )
    }

    render() {
        if (!this.state.shouldRender) {
            return null
        }

        let {rootClassName, rootStyle} = this.props

        return (
            <span className={`ReactMicro ${rootClassName}`} style={rootStyle}>
                {this.renderContent(this.props)}
            </span>
        )
    }
}

Micro.defaultProps = {
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

Micro.propTypes = {
    contentPromise: PropTypes.shape({then: PropTypes.func, catch: PropTypes.func}),
    contentSource: PropTypes.string,
    contentURL: PropTypes.string,
    elementStyles: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string, style: PropTypes.string})),
    iframeStyle: PropTypes.string,
    rootClassName: PropTypes.string,
    rootStyle: PropTypes.object,
    shouldLog: PropTypes.bool,
    type: PropTypes.string
}