'use client';
import useAutoComplete from '@/custom-hooks/useAutoComplete';
import { useState } from 'react';

export default function Home() {
  const {
    bindInput,
    bindOptions,
    bindOption,
    isBusy,
    suggestions,
    selectedIndex,
  } = useAutoComplete({
    onChange: (value: string) => {
      setShoppingList((prev) => [...prev, { value: value, isChecked: false }]);
    },
    source: async (search: string) => {
      try {
        const res = await fetch(
          `https://api.frontendeval.com/fake/food/${search}`
        );
        const data = await res.json();
        return data;
      } catch (e) {
        return [];
      }
    },
  });

  const handleCheck = (position: number) => {
    setShoppingList(
      shoppingList.map((item, index) => {
        if (index === position) {
          return { ...item, isChecked: !item.isChecked };
        } else {
          return item;
        }
      })
    );
  };

  const handleDelete = (position: number) => {
    setShoppingList(
      shoppingList.filter((item, index) => {
        return index !== position;
      })
    );
  };

  const [shoppingList, setShoppingList] = useState<
    { isChecked: boolean; value: string }[]
  >([]);

  return (
    <main className='min-h-screen w-screen flex justify-center'>
      <div className='pt-5 flex flex-col'>
        <h1 className='text-3xl font-bold'>My Shopping List</h1>
        <div className='pt-5 w-96 relative'>
          <input
            type='text'
            placeholder='Add items to your list...'
            className='w-full  border border-black px-2 py-2'
            {...bindInput}
          />
          {suggestions.length > 0 && (
            <div className='border border-black max-h-60 overflow-y-scroll overflow-x-hidden scroll-smooth scrollbar absolute w-full z-10 bg-white'>
              <ul className='px-1' {...bindOptions}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    value={suggestion}
                    className='hover:bg-slate-300 ` + (selectedIndex === index && "bg-slate-300")'
                    {...bindOption}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className='mt-3'>
            <ul>
              {shoppingList.map((item, index) => (
                <li key={index} className='flex items-center w-full'>
                  <input
                    type='checkbox'
                    id={item.value + index}
                    value={item.value}
                    checked={item.isChecked}
                    onChange={() => handleCheck(index)}
                    className={`w-4 h-4 text-blue-600 bg-gray-600 border-gray-300 rounded focus:ring-blue-500`}
                  />
                  <label
                    className={`w-full py-1 ml-2 text-sm font-medium text-black ${
                      item.isChecked && 'line-through'
                    }`}
                    htmlFor={item.value + index}
                  >
                    {item.value}
                  </label>
                  <button
                    className='text-red-500'
                    onClick={() => handleDelete(index)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
