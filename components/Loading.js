import React from 'react'

const Loading = () => {
    return (
        <div className="position-fixed w-100 h-100 text-center loading">
            <svg width="250" height="250" viewBox="0 0 40 50">
                <polygon strokeWidth="1" stroke="#fff" fill="none"
                    points="20,1 40,40 1,40"></polygon>
                <text fill="#fff" x="7" y="47">Loading</text>
            </svg>
        </div>
    )
}

export default Loading;
