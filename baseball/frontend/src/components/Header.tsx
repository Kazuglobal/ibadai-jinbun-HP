import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            菊池雄星 投球分析
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-blue-200">
                  ダッシュボード
                </Link>
              </li>
              <li>
                <Link to="/stats" className="hover:text-blue-200">
                  統計
                </Link>
              </li>
              <li>
                <Link to="/trends" className="hover:text-blue-200">
                  トレンド
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 