'use strict';

exports.__esModule = true;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ChatWindow = require('./ChatWindow');

var _ChatWindow2 = _interopRequireDefault(_ChatWindow);

var _logoNoBg = require('./../assets/logo-no-bg.svg');

var _logoNoBg2 = _interopRequireDefault(_logoNoBg);

var _closeIcon = require('./../assets/close-icon.png');

var _closeIcon2 = _interopRequireDefault(_closeIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Launcher = function (_Component) {
  _inherits(Launcher, _Component);

  function Launcher() {
    _classCallCheck(this, Launcher);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this.state = {
      launcherIcon: _logoNoBg2.default,
      isOpen: false
    };
    return _this;
  }

  Launcher.prototype.handleClick = function handleClick() {
    console.log("handleClick");
    if (this.props.handleClick !== undefined) {
      this.props.handleClick();
    } else {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  };

  Launcher.prototype.handleAdd = function handleAdd() {
    console.log("handleAdd");
    fetch("/chat/addmember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        chatID: this.props.chatID,
        members: ["b8e3af25-bcc0-47ee-917b-3047761d9a46"]
      })
    })
    .then( res => {
      console.log("add member");
      console.log("shit");
    })
  }

  Launcher.prototype.render = function render() {
    var isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen;
    var classList = ['sc-launcher', isOpen ? 'opened' : ''];
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('div', null),
      _react2.default.createElement(
        'div',
        { className: classList.join(' '), onClick: this.handleClick.bind(this) },
        _react2.default.createElement(MessageCount, { count: this.props.newMessagesCount, isOpen: isOpen }),
        _react2.default.createElement('img', { className: "sc-open-icon", src: _closeIcon2.defualt}),
        _react2.default.createElement('p', {className: "sc-friend-name-icon"}, this.props.friendInfo.firstname),
        _react2.default.createElement('img', { className: "sc-closed-icon", src: this.props.friendInfo.photo })
      ),
      _react2.default.createElement(_ChatWindow2.default, {
        messageList: this.props.messageList,
        onUserInputSubmit: this.props.onMessageWasSent,
        agentProfile: this.props.agentProfile,
        isOpen: isOpen,
        friendInfo: this.props.friendInfo,
        chatID: this.props.chatID,
        onClose: this.handleClick.bind(this),
        onAdd: this.handleAdd.bind(this),
        showEmoji: this.props.showEmoji
      })
    );
  };

  return Launcher;
}(_react.Component);

var MessageCount = function MessageCount(props) {
  if (props.count === 0 || props.isOpen === true) {
    return null;
  }
  return _react2.default.createElement(
    'div',
    { className: "sc-new-messsages-count" },
    props.count
  );
};

Launcher.propTypes = process.env.NODE_ENV !== "production" ? {
  onMessageWasReceived: _propTypes2.default.func,
  onMessageWasSent: _propTypes2.default.func,
  newMessagesCount: _propTypes2.default.number,
  isOpen: _propTypes2.default.bool,
  handleClick: _propTypes2.default.func,
  messageList: _propTypes2.default.arrayOf(_propTypes2.default.object),
  showEmoji: _propTypes2.default.bool
} : {};

Launcher.defaultProps = {
  newMessagesCount: 0,
  showEmoji: true
};

exports.default = Launcher;
module.exports = exports['default'];
