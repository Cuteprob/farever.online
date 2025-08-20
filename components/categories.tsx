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

  return (
    <section className="mt-6">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* 标题部分 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl text-gray-900 mb-1">
            Categories & Tags
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
              <button className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg shadow-md transition-all duration-200 hover:bg-primary hover:text-white border border-gray-100">
                {category.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
