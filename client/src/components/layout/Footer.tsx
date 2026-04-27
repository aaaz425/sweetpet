const githubUrl = "https://github.com/aaaz425/sweetpet";
const contactEmail = "ytokogg@gmail.com";

export function Footer() {
  return (
    <footer className="mt-8 flex-none border-t border-border pt-5 text-sm text-text-secondary">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong className="font-semibold text-text-primary">sweetpet</strong>
          <span className="ml-2">© 2026 sweetpet. All rights reserved.</span>
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <a className="font-medium text-primary transition duration-150 hover:text-accent" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          <a className="font-medium text-primary transition duration-150 hover:text-accent" href={githubUrl} rel="noreferrer" target="_blank">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
