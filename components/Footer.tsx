export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fortnite Shop Tracker</h3>
            <p className="text-sm">
              毎日更新されるFortniteのアイテムショップを
              日本語で分かりやすく解説します。
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">リンク</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.epicgames.com/fortnite" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Fortnite公式サイト
                </a>
              </li>
              <li>
                <a href="https://fortnite-api.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Fortnite-API.com
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">免責事項</h3>
            <p className="text-sm">
              このサイトは非公式のファンサイトです。
              Epic Games, Inc.とは一切関係ありません。
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2024 Fortnite Shop Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}