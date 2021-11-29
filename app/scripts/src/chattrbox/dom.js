import $ from 'jquery';
import moment from 'moment';
import md5 from 'crypto-js/md5';

function createGravatarUrl(username) {
  let userhash = md5(username);
  userhash = userhash.toString(); 
  return `http://www.gravatar.com/avatar/${userhash}`;
}

export function promptForUsername() {
  let username = prompt('Enter a username');
  return username.toLowerCase();
}

export class ChatForm {
  constructor(formId, inputId) {
    this.formId = formId;
    this.inputId = inputId;
  }
  init(submitCallback) {
    $(this.formId).submit((event) => {
      event.preventDefault();
      let val = $(this.inputId).val();
      submitCallback(val);
      $(this.inputId).val('');
    });
    $(this.formId).find('button').on('click', () => {
      $(this.formId).submit();
    });
  }
}

export class ChatList {
  constructor(listId, username) {
    this.listId = listId;
    this.odd = false;
    this.username = username;
  }
  drawMessage(messageData) {
    var $messageRow = $('<li>', {
      class: 'message-row'
    });

    // console.log('logging this.username', this.username);
    // console.log('logging this.messageData.user', messageData.user);
    if (this.username === messageData.user) {
        // console.log('adding me');
        $messageRow.addClass('me');
    }

    var $message = $('<p>');

    $message.append($('<span>', {
      class: 'message-username',
      text: messageData.user
    }));

    $message.append($('<span>', {
      class: 'timestamp',
    'data-time': messageData.timestamp,
      text: moment(messageData.timeStamp).fromNow()
    }));

    $message.append($('<span>', {
      class: 'message-message',
      text: messageData.message
    }));

    var $img = $('<img>', {
      src: createGravatarUrl(messageData.user),
      title: messageData.user
    });


    $messageRow.append($img);
    $messageRow.append($message);
    $(this.listId).append($messageRow);
    $messageRow.get(0).scrollIntoView();
  }

  init() {
    this.timer = setInterval(() => {
        $('[data-time]').each((idx, element) => {
            let $element = $(element);
            let timestamp = new Date().setTime($element.attr('data-time'));
            let ago = moment(timestamp).fromNow();
            $element.html(ago);
        });
    }, 1000);
  }
}
