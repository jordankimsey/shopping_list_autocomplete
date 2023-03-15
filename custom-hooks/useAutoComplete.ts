import { useRef, useState } from 'react';

export default function useAutoComplete({
  delay = 500,
  source,
  onChange,
}: any) {
  const [myTimeout, setMyTimeOut] = useState(setTimeout(() => {}, 0));
  const listRef = useRef();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isBusy, setBusy] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [textValue, setTextValue] = useState('');

  function delayInvoke(cb: any) {
    if (myTimeout) {
      clearTimeout(myTimeout);
    }
    setMyTimeOut(setTimeout(cb, delay));
  }

  function selectOption(index: number) {
    if (index > -1) {
      onChange(suggestions[index]);
      setTextValue(suggestions[index]);
    }
    clearSuggestions();
  }

  async function getSuggestions(searchTerm: string) {
    if (searchTerm && source) {
      const options = await source(searchTerm);
      setSuggestions(options);
    }
  }

  function clearSuggestions() {
    setSuggestions([]);
    setSelectedIndex(-1);
  }

  function onTextChange(searchTerm: string) {
    setBusy(true);
    setTextValue(searchTerm);
    clearSuggestions();
    delayInvoke(() => {
      getSuggestions(searchTerm);
      setBusy(false);
    });
  }

  return {
    bindOption: {
      onClick: (e: React.ChangeEvent<HTMLInputElement>) => {
        let nodes = Array.from(listRef.current?.children);
        selectOption(nodes.indexOf(e.target.closest('li')));
        setTextValue('');
      },
    },
    bindInput: {
      value: textValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onTextChange(e.target.value),
    },
    bindOptions: {
      ref: listRef,
    },
    isBusy,
    suggestions,
    selectedIndex,
  };
}
