'use strict';

import React, { requireNativeComponent, DeviceEventEmitter, PropTypes, View } from 'react-native';
var { addons: { PureRenderMixin }, NativeModules: { UIManager, CrosswalkWebViewManager: { JSNavigationScheme } } } = React;

var WEBVIEW_REF = 'crosswalkWebView';

var CrosswalkWebView = React.createClass({
    mixins:    [PureRenderMixin],
    statics:   { JSNavigationScheme },
    propTypes: {
        localhost:               PropTypes.bool.isRequired,
        onNavigationStateChange: PropTypes.func,
        url:                     PropTypes.string,
        injectedJavaScript:      PropTypes.string,
        onBridgeMessage:         PropTypes.func,
        ...View.propTypes
    },
    getDefaultProps () {
        return {
            localhost: false
        };
    },
    componentWillMount: function() {
        DeviceEventEmitter.addListener("crosswalkWebViewBridgeMessage", (body) => {
            console.log(body);
            const { onBridgeMessage } = this.props;
            const message = body.message;
            if (onBridgeMessage) {
                onBridgeMessage(message);
            }
        });
    },
    render () {
        return (
            <NativeCrosswalkWebView
                { ...this.props }
                onNavigationStateChange={ this.onNavigationStateChange }
                ref={ WEBVIEW_REF }/>
        );
    },
    getWebViewHandle () {
        return React.findNodeHandle(this.refs[WEBVIEW_REF]);
    },
    onNavigationStateChange (event) {
        var { onNavigationStateChange } = this.props;
        if (onNavigationStateChange) {
            onNavigationStateChange(event.nativeEvent);
        }
    },
    goBack () {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.CrosswalkWebView.Commands.goBack,
            null
        );
    },
    goForward () {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.CrosswalkWebView.Commands.goForward,
            null
        );
    },
    reload () {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.CrosswalkWebView.Commands.reload,
            null
        );
    },
    sendToBridge (message: string) {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.CrosswalkWebView.Commands.sendToBridge,
            [message]
        );
    },
});

var NativeCrosswalkWebView = requireNativeComponent('CrosswalkWebView', CrosswalkWebView);

export default CrosswalkWebView;
