import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

const UNIQUE_ID = Math
    .random()
    .toString(36)
    .substr(2, 5) + '_' + new Date().getTime();

export default class Micro extends PureComponent {
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

        this.setContent(p.data)
    }

    setContent = content => {
        const DATA_URL = URL.createObjectURL(content)
        document
            .getElementById(`frame_${UNIQUE_ID}`)
            .src = DATA_URL
    }

    renderContent = settings => {
        let {iframeClassName, iframeTitle, iframeStyle} = settings

        return (
            <iframe
                id={`frame_${UNIQUE_ID}`}
                title={iframeTitle}
                className={`ReactMicro__Frame ${iframeClassName}`}
                style={iframeStyle}></iframe>
        )
    }

    render() {
        let {rootClassName, rootStyle} = this.props

        return (
            <span className={`ReactMicro ${rootClassName}`} style={rootStyle}>
                {this.renderContent(this.props)}
            </span>
        )
    }
}

Micro.defaultProps = {
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
    contentPromise: PropTypes.isRequired,
    iframeStyle: PropTypes.object,
    rootClassName: PropTypes.string,
    rootStyle: PropTypes.object,
    type: PropTypes.string
}