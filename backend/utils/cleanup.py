import os
import shutil


def main():
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    data_dir = os.path.join(project_root, "data")
    if os.path.isdir(data_dir):
        shutil.rmtree(data_dir)
        print(f"Deleted {data_dir}")
    else:
        print("No data directory found.")

    notion_pages = os.path.join(project_root, "notion_pages.json")
    if os.path.isfile(notion_pages):
        os.remove(notion_pages)
        print(f"Deleted {notion_pages}")
    else:
        print("No notion_pages.json found.")


if __name__ == "__main__":
    main()
