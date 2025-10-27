'use client';

export default function About() {
  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              About Karunadasa Hardware
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Located in the heart of Athurugiriya, we're your one-stop shop for all hardware 
                and building material needs. From small DIY projects to large construction sites, 
                we've got you covered.
              </p>
              <p>
                Our store stocks everything from basic hand tools to heavy-duty construction 
                materials. We work with trusted suppliers to bring you quality products at 
                competitive prices.
              </p>
              <p>
                Whether you're a professional contractor, builder, or homeowner working on a 
                weekend project, our knowledgeable staff is here to help you find exactly 
                what you need.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">Athurugiriya</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Serving Our Community</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">Trusted</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Local Business</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-12 flex items-center justify-center">
            <div className="text-center">
              <img
                src="/hw_logo.png"
                alt="Karunadasa Hardware Logo"
                className="w-32 h-32 object-contain mx-auto mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400 italic">
                "Quality products, honest service"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
