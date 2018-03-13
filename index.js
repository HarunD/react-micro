import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

const UNIQUE_ID = Math
    .random()
    .toString(36)
    .substr(2, 5) + '_' + new Date().getTime();

export default class Micro extends PureComponent {
    state = {
        shouldRenderMicro: false
    }

    componentDidMount() {
        this.fetchContent(this.props.contentPromise)
    }

    fetchContent = async contentPromise => {
        let p

        try {
            p = await contentPromise
        } catch (err) {
            console.error("react-micro : ", err)
        }

        if (p) {
            this.setState({
                shouldRenderMicro: true
            }, () => {
                this.setContent(p.data)
            })
        }
    }

    setContent = content => {
        const DATA_URL = URL.createObjectURL(content)
        document
            .getElementById(`frame_${UNIQUE_ID}`)
            .src = DATA_URL

        setTimeout(() => {
            this.setStyles()
        }, 300)
    }

    styleContent = () => {
        const RE = document.getElementById(`frame_${UNIQUE_ID}`)
        const ES = this.props.elementStyles

        ES.forEach(el => {
            let $ = RE
                .contentDocument
                .getElementById(el.id)
            if ($) {
                $.style.cssText += `; ${el.style}`
            }
        });
    }

    setIframeVisible = () => {
        let I = document.getElementById(`frame_${UNIQUE_ID}`)
        I.contentDocument.body.style.margin = 0
        I.style.visibility = 'visible'
    }

    setStyles = () => {
        if (this.props.elementStyles && this.props.elementStyles.length > 0) {
            this.styleContent()
        }

        this.setIframeVisible()
    }

    renderContent = settings => {
        let {iframeClassName, iframeTitle, iframeStyle} = settings

        return (
            <iframe
                id={`frame_${UNIQUE_ID}`}
                title={iframeTitle}
                className={`ReactMicro__Frame ${iframeClassName}`}
                style={{
                ...iframeStyle,
                visibility: 'hidden'
            }}></iframe>
        )
    }

    render() {
        if (!this.state.shouldRenderMicro) {
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
    elementStyles: [],
    iframeClassName: '',
    iframeStyle: {
        border: 'none',
        padding: 0,
        margin: 0
    },
    iframeTitle: 'react-micro-iframe-' + UNIQUE_ID,
    rootClassName: '',
    rootStyle: {},
    type: 'iframe'
}

Micro.PropTypes = {
    elementStyles: PropTypes.arrayOf.object,
    contentPromise: PropTypes.objectOf({then: PropTypes.func, catch: PropTypes.func}),
    iframeStyle: PropTypes.object,
    rootClassName: PropTypes.string,
    rootStyle: PropTypes.object,
    type: PropTypes.string
}