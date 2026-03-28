import Link from "next/link"

interface Category {
  name: string;
  href: string;
  count?: number;
}

interface CategoriesProps {
  categories?: Category[];
}

export function Categories({ categories }: CategoriesProps) {
  const displayCategories = categories || [];

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="mt-6 bg-theme-dark-800 rounded-lg p-theme-lg border border-theme-dark-600">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* 标题部分 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-theme-heading font-semibold text-primary mb-1">
            Categories
          </h2>
        </div>

        {/* 分类按钮 */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {displayCategories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group"
            >
              <button className="px-4 py-2 bg-theme-dark-700 text-primary text-sm font-theme-body font-semibold rounded-lg shadow-md transition-all duration-200 hover:bg-theme-fire-500 hover:text-white border border-theme-dark-600">
                {category.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
