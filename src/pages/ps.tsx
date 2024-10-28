import { CHILDREN_CONTAINER_STYLES, COMMON_PADDING } from '@/hocs/withoutContainer';

import { getGapClass, getMarginBottomClass, PaddingSize } from '@/utilities/styling';
import { RootComponentInstance } from '@uniformdev/canvas';
import { UniformComponent } from '@uniformdev/canvas-react';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';

interface SearchResult {
  totalCount?: number;
  compositions: { composition: RootComponentInstance }[];
}

interface Category {
  name: string;
  id: string;
  order?: number;
}

export default function PatternSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult>();
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const handleCheckboxChange = (item: string) => {
    setCheckedItems(prevState =>
      prevState.includes(item) ? prevState.filter(checkedItem => checkedItem !== item) : [...prevState, item]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch('/api/getPatternCategories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const json = await data.json();

        setCategories(json);
      } catch (error) {
        console.error('Error fetching results:', error);
        setCategories([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await fetch('/api/getPatterns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword: searchTerm, categories: checkedItems }),
        });

        const json = await data.json();

        setResults(json);
      } catch (error) {
        console.error('Error fetching results:', error);
        setResults({ totalCount: -1, compositions: [] });
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, checkedItems]);

  const handleSearchChange = (e: ChangeEvent) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setSearchTerm(e.target.value);
  };

  const gap = 'Medium' as PaddingSize | undefined;

  return (
    <div
      className={classNames(
        'flex flex-col flex-1',
        CHILDREN_CONTAINER_STYLES,
        COMMON_PADDING,
        getGapClass(gap),
        getMarginBottomClass(gap)
      )}
    >
      {isLoading ? <p>Loading...</p> : <p>Loaded!</p>}
      <div>
        <h3>Select Options</h3>
        {categories?.map((item, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                value={item.id}
                checked={checkedItems.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
              />
              {item.name}
            </label>
          </div>
        ))}
      </div>

      <h1>Search Example. Total: {results?.totalCount}</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {results?.compositions?.map((element: { composition: RootComponentInstance }) => (
        <div key={element?.composition?._id} className="my-4 border p-4">
          <UniformComponent data={element?.composition} />
        </div>
      ))}
    </div>
  );
}
