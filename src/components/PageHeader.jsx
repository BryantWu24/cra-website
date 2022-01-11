import React, { Component } from 'react';

class Pageheader extends Component {
    render() {
        const { title } = this.props
        return (
            <div style={{ fontSize: '1.5rem', textAlign: 'center', width: '100%', marginTop: '1rem', fontWeight: 'bolder', fontFamily: '微軟正黑體' }}>
                {title}
            </div >
        );
    }
}

export default Pageheader;
