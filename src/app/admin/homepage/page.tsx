import { BannerManager } from '@/components/admin/banner-manager';

export default function ManageHomepage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Manage Homepage Banners</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900 font-semibold mb-2">📍 Banner Placement:</p>
          <ul className="text-sm text-blue-800 space-y-1 ml-4">
            <li>• <strong>First Banner:</strong> Displays above the Shop by Category section</li>
            <li>• <strong>Second Banner:</strong> Displays below the Category Carousel</li>
            <li>• Additional banners can be added and will be available in future sections</li>
          </ul>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-900 font-semibold mb-2">✨ Banner Features:</p>
          <ul className="text-sm text-green-800 space-y-1 ml-4">
            <li>• Upload banner image</li>
            <li>• Add title and subtitle text (appears with dark overlay)</li>
            <li>• Optional: Add button text and link for call-to-action</li>
            <li>• Customize background color</li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Upload and Manage Banners</h2>
        <p className="text-sm text-muted-foreground mb-4">Upload images and add text to create attractive banners for your homepage sections.</p>
        <BannerManager type="home" />
      </div>

      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Shop by Category - Viva Banner</h2>
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-cyan-900 font-semibold mb-2">📍 Banner Placement:</p>
          <p className="text-sm text-cyan-800 ml-4">Displays on the left side of the Shop by Category section with 3 product cards overlay at the bottom.</p>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-cyan-900 font-semibold mb-2">✨ Banner Features:</p>
          <ul className="text-sm text-cyan-800 space-y-1 ml-4">
            <li>• Upload banner image (static background)</li>
            <li>• Add title and subtitle text</li>
            <li>• Optional: Add button text and link (Shop now)</li>
            <li>• Customize text color for readability</li>
          </ul>
        </div>
        <BannerManager type="viva" />
      </div>
    </div>
  );
}
