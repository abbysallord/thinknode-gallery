# ThinkNode Gallery Showcase 🎨

An award-winning gallery landing page designed to showcase premium projects with a high-end, interactive user experience. This project uses an **Apple-style Carousel** layout to highlight individual projects with smooth animations and detailed expanded views.

## ✨ Features

- **Premium UI/UX**: Designed with a focus on aesthetics and user engagement.
- **Apple-Style Carousel**: A horizontal, touch-friendly scrollable list of project cards.
- **Interactive Details**: Click on any card to expand it into a focused modal view with project details.
- **Smooth Animations**: Powered by **Framer Motion** for fluid transitions and interactions.
- **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
- **Modern Tech Stack**: Built with the latest web technologies.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Directory)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: Custom, reusable UI components (Carousel, Cards).
- **Language**: TypeScript

## 🚀 Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/thinknode-gallery.git
    cd thinknode-gallery
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 📂 Project Structure

```
thinknode-gallery/
├── app/
│   ├── data/           # Project data (titles, links, images)
│   ├── page.tsx        # Main landing page
│   └── layout.tsx      # Root layout
├── components/
│   ├── ui/             # Reusable UI components (Carousel, Cards, etc.)
│   └── ProjectsCarousel.tsx # Main carousel wrapper component
├── public/
│   └── images/         # Project screenshots and assets
├── lib/                # Utility functions (cn, etc.)
└── ...
```

## 🖼️ Customization

### Adding New Projects

To add or modify projects, edit the `app/data/projects.ts` file:

```typescript
export const projects = [
  {
    title: "New Project",
    link: "https://example.com",
    thumbnail: "/images/new-project.jpg",
  },
  // ...
];
```

Ensure you add the corresponding image to the `public/images` directory.

## 📄 License

This project is licensed under the MIT License.
