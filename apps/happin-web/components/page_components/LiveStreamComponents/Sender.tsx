import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import classnames from 'classnames';
import { getCaretIndex, getSelection, insertNodeAtCaret, isFirefox, updateCaret } from 'utils/contentEditable';
import SvgIcon from '@components/SvgIcon';
import IconPark from '@components/IconPark';

type SenderProps = {
  placeholder?: string;
  disabled?: boolean;
  maxlength?: number;
  sendMessage: (event: any) => void;
  emojiShow: boolean;
  onPressEmoji: () => void;
  onTextInputChange?: (event: any) => void;
  onClick?: (event: any) => void;
}

function Sender(props: SenderProps, ref: any) {
  const {
    sendMessage,
    placeholder,
    disabled,
    maxlength,
    emojiShow,
    onPressEmoji,
    onTextInputChange,
    onClick
  } = props;

  const inputRef = useRef<HTMLDivElement>(null!);
  const [senderHeight, setSenderHeight] = useState(18);
  const [enter, setEnter] = useState(false);
  const [firefox, setFirefox] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    setFirefox(isFirefox());
  }, []);

  useEffect(() => {
    if (disabled) {
      const el = inputRef.current;
      if (el.innerHTML) {
        el.innerHTML = '';
        setValue('');
      }
    }
  }, [disabled]);

  useImperativeHandle(ref, () => {
    return {
      onSelectEmoji: handlerOnSelectEmoji,
      focus: () => {
        const el = inputRef.current;
        el.focus();
        if (el.innerText.length > 0) {
          updateCaret(el, el.innerHTML.length, 0);
        }
      }
    };
  });

  const handlerOnChange = (event: any) => {
    setValue(inputRef.current.innerHTML);
    onTextInputChange && onTextInputChange(event);
  };

  const handlerSendMessage = () => {
    if (disabled) return;
    const el = inputRef.current;
    if (el.innerHTML) {
      sendMessage(el.innerText);
      el.innerHTML = '';
      setValue('');
      setSenderHeight(el.clientHeight);
    }
  };

  const handlerOnSelectEmoji = (emoji: any) => {
    const el = inputRef.current;
    if (maxlength && maxlength > 0) {
      const total = el.innerHTML.length;
      if (total >= maxlength) {
        return false;
      }
    }
    const { start, end } = getSelection(el);
    if (el.innerHTML) {
      const firstPart = el.innerHTML.substring(0, start);
      const secondPart = el.innerHTML.substring(end);
      el.innerHTML = (`${firstPart}${emoji.native}${secondPart}`);
    } else {
      el.innerHTML = emoji.native;
    }
    setValue(el.innerHTML);
    setSenderHeight(el.clientHeight);
    updateCaret(el, start, emoji.native.length);
  };

  const handlerOnKeyPress = (event: any) => {
    const el = inputRef.current;
    if (maxlength && maxlength > 0) {
      const total = el.innerHTML.length;
      if (total >= maxlength) {
        event.preventDefault();
      }
    }
    if (event.charCode == 13 && !event.shiftKey) {
      event.preventDefault();
      handlerSendMessage();
    }
    if (event.charCode === 13 && event.shiftKey) {
      event.preventDefault();
      insertNodeAtCaret(el);
      setEnter(true);
    }
  };

  const handlerOnKeyUp = (event: any) => {
    const brRegex = /<br>/g;
    const el = inputRef.current;
    if (!el) return true;
    if (maxlength && maxlength > 0) {
      if (el.innerHTML.length >= maxlength) {
        el.innerHTML = el.innerHTML.substr(0, maxlength);
        el.blur();
        setValue(el.innerHTML);
      }
    }
    // Conditions need for firefox
    if (firefox && event.key === 'Backspace') {
      if (el.innerHTML.length === 1 && enter) {
        el.innerHTML = '';
        setEnter(false);
      } else if (brRegex.test(el.innerHTML)) {
        el.innerHTML = el.innerHTML.replace(brRegex, '');
      }
    }
    setSenderHeight(el.clientHeight);
  };

  const handlerOnKeyDown = (event: any) => {
    const el = inputRef.current;
    // Fixed the cursor automatically goes to the beginning of the text
    if (event.key === 'Backspace' && el) {
      const caretPosition = getCaretIndex(inputRef.current);
      const character = el.innerHTML.charAt(caretPosition - 1);
      if (character === '\n') {
        event.preventDefault();
        event.stopPropagation();
        el.innerHTML = (el.innerHTML.substring(0, caretPosition - 1) + el.innerHTML.substring(caretPosition));
        updateCaret(el, caretPosition, -1);
      }
    }
  };

  const handlerPressEmoji = () => {
    !disabled && onPressEmoji();
  };

  return (
    <div className="relative flex items-end py-2 px-2 w-full">
      <div
        className={classnames('livestream__sender-emoji', { 'bg-gray-700': emojiShow, disabled })}
        onClick={handlerPressEmoji}
      >
        <IconPark name="grinning-face-with-open-mouth" size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="livestream__sender-wrapper">
          <div
            spellCheck
            className={classnames('livestream__sender-input', { disabled })}
            contentEditable={!disabled}
            ref={inputRef}
            placeholder={placeholder}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData('text');
              document.execCommand('insertText', false, text);
            }}
            onInput={handlerOnChange}
            onKeyPress={handlerOnKeyPress}
            onKeyUp={handlerOnKeyUp}
            onKeyDown={handlerOnKeyDown}
            onClick={onClick}
          />
        </div>
        {
          maxlength && senderHeight > 18 && (
            <span className="text-gray-400 text-sm leading-none font-medium">
              <span className={classnames({ 'text-rose-500': value.length >= maxlength })}>{value.length}</span>
              <span className="mx-0.5">/</span>
              <span>{maxlength}</span>
            </span>
          )
        }
      </div>
      <div
        className={classnames('livestream__sender-button', { disabled: disabled || !value.length })}
        onClick={handlerSendMessage}>
        <SvgIcon id="send" className="text-xl" />
      </div>
    </div>
  );
}

export default forwardRef(Sender);
