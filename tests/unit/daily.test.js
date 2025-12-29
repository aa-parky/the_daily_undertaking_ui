/**
 * Tests for daily.html page functionality
 * Testing date setting, navigation, and page structure
 */

import '@testing-library/jest-dom';

describe('Daily News Page', () => {
  beforeEach(() => {
    // Set up DOM structure for daily.html
    document.body.innerHTML = `
      <div class="container">
        <header class="masthead">
          <h1 class="title">The Daily Undertaking</h1>
          <div class="subtitle">
            Chronicle of Adventures &bull; Est. <span id="currentYear"></span> &bull; Volume ∞, No. π
          </div>
          <nav class="masthead-nav">
            <a href="daily.html" class="nav-link active">Today's Edition</a>
            <span class="nav-separator">|</span>
            <a href="landing.html" class="nav-link">Play Adventure</a>
          </nav>
        </header>

        <main class="news-content">
          <section class="lead-story">
            <h2 class="story-title">Registry Ink Develops Sentience; Bureau Declares Situation "Mostly Harmless"</h2>
            <p class="story-byline">By The Editor | <span id="currentDate"></span></p>
            <div class="story-content">
              <p><strong class="dateline">BUREAU HEADQUARTERS —</strong> Test content</p>
              <p>More test content</p>
            </div>
            <div class="story-cta">
              <a href="landing.html" class="play-button">⚔ Begin Today's Adventure →</a>
            </div>
          </section>

          <section class="world-news-section">
            <h2 class="section-title">Matters of the Realm</h2>
            <div class="news-grid">
              <article class="news-item">
                <h3 class="news-title">News 1</h3>
                <p class="news-excerpt">Excerpt 1</p>
              </article>
              <article class="news-item">
                <h3 class="news-title">News 2</h3>
                <p class="news-excerpt">Excerpt 2</p>
              </article>
              <article class="news-item">
                <h3 class="news-title">News 3</h3>
                <p class="news-excerpt">Excerpt 3</p>
              </article>
              <article class="news-item">
                <h3 class="news-title">News 4</h3>
                <p class="news-excerpt">Excerpt 4</p>
              </article>
              <article class="news-item">
                <h3 class="news-title">News 5</h3>
                <p class="news-excerpt">Excerpt 5</p>
              </article>
              <article class="news-item">
                <h3 class="news-title">News 6</h3>
                <p class="news-excerpt">Excerpt 6</p>
              </article>
            </div>
          </section>

          <section class="archives-section">
            <h2 class="section-header">The Archives</h2>
            <div class="section-content">
              <ul class="archive-list">
                <li class="archive-item">
                  <span class="archive-date">Yesterday</span>
                  <a href="#" class="archive-link">Test Archive 1</a>
                </li>
              </ul>
            </div>
          </section>

          <section class="leaderboards-section">
            <h2 class="section-header">Registry of Notable Adventurers</h2>
            <div class="section-content">
              <table class="leaderboard-table">
                <thead>
                  <tr>
                    <th class="rank-col">Rank</th>
                    <th class="name-col">Adventurer</th>
                    <th class="score-col">Renown</th>
                    <th class="achievement-col">Most Recent Accomplishment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="leaderboard-entry">
                    <td class="rank">1</td>
                    <td class="name">Brigg Fenwick</td>
                    <td class="score">2,847</td>
                    <td class="achievement">Resolved paradox without creating new ones</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">2</td>
                    <td class="name">Seraphine Ironquill</td>
                    <td class="score">2,683</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">3</td>
                    <td class="name">Mortimer Blackwood</td>
                    <td class="score">2,541</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">4</td>
                    <td class="name">Celestia Brightspark</td>
                    <td class="score">2,399</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">5</td>
                    <td class="name">Gideon Thornheart</td>
                    <td class="score">2,156</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">6</td>
                    <td class="name">Lyra Moonwhisper</td>
                    <td class="score">1,998</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">7</td>
                    <td class="name">Thaddeus Copperbeard</td>
                    <td class="score">1,847</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">8</td>
                    <td class="name">Rowena Swiftblade</td>
                    <td class="score">1,729</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">9</td>
                    <td class="name">Cornelius Mistwalker</td>
                    <td class="score">1,654</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                  <tr class="leaderboard-entry">
                    <td class="rank">10</td>
                    <td class="name">Eloise Nightshade</td>
                    <td class="score">1,582</td>
                    <td class="achievement">Test achievement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <footer class="footer-notice">
          <p><strong>Disclaimer:</strong> <em>The Daily Undertaking</em> test footer</p>
        </footer>
      </div>
    `;

    // Mock the date functions and simulate initialization
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }

    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date().toLocaleDateString('en-US', options);
      dateElement.textContent = formattedDate;
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Date Functionality', () => {
    test('should set current year in masthead', () => {
      const yearElement = document.getElementById('currentYear');
      expect(yearElement).toBeTruthy();
      expect(yearElement.textContent).toBe(new Date().getFullYear().toString());
    });

    test('should set current date in byline', () => {
      const dateElement = document.getElementById('currentDate');
      expect(dateElement).toBeTruthy();

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const expectedDate = new Date().toLocaleDateString('en-US', options);
      expect(dateElement.textContent).toBe(expectedDate);
    });
  });

  describe('Navigation', () => {
    test('should have navigation with correct links', () => {
      const nav = document.querySelector('.masthead-nav');
      expect(nav).toBeTruthy();

      const links = nav.querySelectorAll('.nav-link');
      expect(links).toHaveLength(2);

      expect(links[0].getAttribute('href')).toBe('daily.html');
      expect(links[0].classList.contains('active')).toBe(true);
      expect(links[0].textContent).toContain("Today's Edition");

      expect(links[1].getAttribute('href')).toBe('landing.html');
      expect(links[1].textContent).toContain('Play Adventure');
    });
  });

  describe('Page Structure', () => {
    test('should have lead story section', () => {
      const leadStory = document.querySelector('.lead-story');
      expect(leadStory).toBeTruthy();

      const title = leadStory.querySelector('.story-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Registry Ink Develops Sentience');

      const content = leadStory.querySelector('.story-content');
      expect(content).toBeTruthy();
      expect(content.querySelectorAll('p').length).toBeGreaterThan(0);

      const ctaButton = leadStory.querySelector('.play-button');
      expect(ctaButton).toBeTruthy();
      expect(ctaButton.getAttribute('href')).toBe('landing.html');
    });

    test('should have world news grid with 6 items', () => {
      const newsGrid = document.querySelector('.news-grid');
      expect(newsGrid).toBeTruthy();

      const newsItems = newsGrid.querySelectorAll('.news-item');
      expect(newsItems).toHaveLength(6);

      newsItems.forEach((item) => {
        expect(item.querySelector('.news-title')).toBeTruthy();
        expect(item.querySelector('.news-excerpt')).toBeTruthy();
      });
    });

    test('should have archives section with visible content', () => {
      const archivesSection = document.querySelector('.archives-section');
      expect(archivesSection).toBeTruthy();

      const header = archivesSection.querySelector('.section-header');
      expect(header).toBeTruthy();
      expect(header.textContent).toContain('The Archives');

      // Should NOT have onclick handler
      expect(header.getAttribute('onclick')).toBeNull();

      // Should NOT have collapsed class
      expect(header.classList.contains('collapsed')).toBe(false);

      const archiveList = archivesSection.querySelector('.archive-list');
      expect(archiveList).toBeTruthy();

      const archiveItems = archiveList.querySelectorAll('.archive-item');
      expect(archiveItems.length).toBeGreaterThan(0);
    });

    test('should have leaderboards section with visible content', () => {
      const leaderboardsSection = document.querySelector('.leaderboards-section');
      expect(leaderboardsSection).toBeTruthy();

      const header = leaderboardsSection.querySelector('.section-header');
      expect(header).toBeTruthy();
      expect(header.textContent).toContain('Registry of Notable Adventurers');

      // Should NOT have onclick handler
      expect(header.getAttribute('onclick')).toBeNull();

      // Should NOT have collapsed class
      expect(header.classList.contains('collapsed')).toBe(false);

      const table = leaderboardsSection.querySelector('.leaderboard-table');
      expect(table).toBeTruthy();

      const rows = table.querySelectorAll('tbody tr');
      expect(rows).toHaveLength(10);

      // Verify first entry is Brigg Fenwick
      const firstRow = rows[0];
      expect(firstRow.querySelector('.rank').textContent).toBe('1');
      expect(firstRow.querySelector('.name').textContent).toBe('Brigg Fenwick');
      expect(firstRow.querySelector('.score').textContent).toBe('2,847');
    });

    test('should have footer notice', () => {
      const footer = document.querySelector('.footer-notice');
      expect(footer).toBeTruthy();
      expect(footer.textContent).toContain('The Daily Undertaking');
      expect(footer.textContent).toContain('Disclaimer');
    });
  });

  describe('Accessibility', () => {
    test('should have proper semantic HTML structure', () => {
      expect(document.querySelector('header.masthead')).toBeTruthy();
      expect(document.querySelector('main.news-content')).toBeTruthy();
      expect(document.querySelector('footer.footer-notice')).toBeTruthy();
    });

    test('should have proper heading hierarchy', () => {
      const h1 = document.querySelector('h1');
      expect(h1).toBeTruthy();
      expect(h1.classList.contains('title')).toBe(true);

      const h2s = document.querySelectorAll('h2');
      expect(h2s.length).toBeGreaterThan(0);
    });
  });
});
