import os
import time
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
from playwright.sync_api import sync_playwright

DIST_DIR = os.path.join(os.path.dirname(__file__), 'dist')
PORT = 4173
SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), 'screenshots')
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            self.path = '/index.html'
        return super().do_GET()

def start_server():
    server = HTTPServer(('127.0.0.1', PORT), SPAHandler)
    server.serve_forever()

def capture():
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    time.sleep(1)

    base_url = f'http://127.0.0.1:{PORT}'

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 850}, device_scale_factor=2)
        page = context.new_page()

        print("1. Capturing Home Dashboard...")
        page.goto(base_url, wait_until='networkidle')
        page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, '01_home_dashboard.png'))

        print("2. Capturing Full Mock Test Interface...")
        # Click Start Full Mock Test button
        hero_mock_btn = page.locator("button:has-text('Start Full'), button:has-text('Mock Test')").first
        hero_mock_btn.click()
        page.wait_for_timeout(600)
        
        # Select Option A for Question 1
        option = page.locator(".option-card, .option-item, label.option, button.option-btn").first
        if option.is_visible():
            option.click()
            page.wait_for_timeout(300)

        # Mark for review
        mark_btn = page.locator("button:has-text('Mark'), button:has-text('Review')").first
        if mark_btn.is_visible():
            mark_btn.click()
            page.wait_for_timeout(300)

        page.screenshot(path=os.path.join(SCREENSHOT_DIR, '02_full_mock_test.png'))

        print("3. Capturing Question Navigator Palette...")
        # Toggle navigator if drawer button exists, or screenshot palette area
        nav_toggle = page.locator("button:has-text('Navigator'), button:has-text('Palette'), .nav-toggle-btn").first
        if nav_toggle.is_visible():
            nav_toggle.click()
            page.wait_for_timeout(500)
        
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, '03_question_navigator.png'))

        print("4. Capturing Submission Verification Modal...")
        submit_btn = page.locator("button:has-text('Submit'), button:has-text('Finish')").first
        if submit_btn.is_visible():
            submit_btn.click()
            page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, '05_submit_modal.png'))

            print("5. Capturing Quiz Results & Performance Analytics...")
            confirm_btn = page.locator(".modal-content button:has-text('Submit'), .modal-content button:has-text('Yes'), .modal-footer button").first
            if confirm_btn.is_visible():
                confirm_btn.click()
                page.wait_for_timeout(800)

        page.screenshot(path=os.path.join(SCREENSHOT_DIR, '06_results_analytics.png'))

        print("6. Capturing Detailed Answer Review System...")
        review_btn = page.locator("button:has-text('Review Answers'), button:has-text('Review')").first
        if review_btn.is_visible():
            review_btn.click()
            page.wait_for_timeout(600)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, '07_answer_review.png'))

        print("7. Capturing Practice by Subject Mode...")
        # Return Home
        home_brand = page.locator(".navbar-brand, button:has-text('Home'), .nav-link:has-text('Home')").first
        if home_brand.is_visible():
            home_brand.click()
            page.wait_for_timeout(500)
        else:
            page.goto(base_url, wait_until='networkidle')

        # Click Mathematics subject practice card or filter
        subj_btn = page.locator(".subject-card, button:has-text('Mathematics'), div:has-text('Mathematics')").first
        if subj_btn.is_visible():
            subj_btn.click()
            page.wait_for_timeout(600)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, '04_subject_practice.png'))

        print("8. Capturing Test History & Analytics...")
        history_nav = page.locator("button:has-text('History'), .nav-link:has-text('History')").first
        if history_nav.is_visible():
            history_nav.click()
            page.wait_for_timeout(600)
        else:
            page.goto(base_url, wait_until='networkidle')
            history_hero = page.locator("button:has-text('History')").first
            if history_hero.is_visible():
                history_hero.click()
                page.wait_for_timeout(600)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, '08_test_history.png'))

        print("9. Capturing Dark Mode Theme...")
        theme_toggle = page.locator("button:has-text('🌙'), button:has-text('☀️'), button[title*='Theme'], .theme-toggle").first
        if theme_toggle.is_visible():
            theme_toggle.click()
            page.wait_for_timeout(500)
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, '09_dark_mode_history.png'))

        browser.close()
        print("All 9 screenshots captured successfully!")

if __name__ == '__main__':
    capture()
