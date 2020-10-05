package international.idems.somanyumbani

import android.app.Activity
import android.util.Log
import androidx.test.espresso.web.internal.deps.guava.collect.Iterables
import androidx.test.espresso.web.sugar.Web
import androidx.test.espresso.web.sugar.Web.onWebView
import androidx.test.espresso.web.webdriver.DriverAtoms.findElement
import androidx.test.espresso.web.webdriver.DriverAtoms.webClick
import androidx.test.espresso.web.webdriver.Locator
import androidx.test.ext.junit.rules.ActivityScenarioRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import androidx.test.platform.app.InstrumentationRegistry
import androidx.test.runner.lifecycle.ActivityLifecycleMonitorRegistry
import androidx.test.runner.lifecycle.Stage
import com.google.android.libraries.cloudtesting.screenshots.ScreenShotter
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import tools.fastlane.screengrab.Screengrab


const val TAG = "APP_TEST";

@LargeTest
@RunWith(AndroidJUnit4::class)
// assert AppCompatActivity for use with screenshotter
class SomaNyumbaniTest {

  @get:Rule
  val activityScenario = ActivityScenarioRule(MainActivity::class.java)

  @Before
  fun initialize() {
    Log.d(TAG, "setup");
    // ensure splash screen gone and webview visible
    Thread.sleep(3000)
    onWebView().forceJavascriptEnabled()
  }

  @Test
  fun somaNyumbaniTest() {
    // Added a sleep statement to match the app's execution delay.
    // The recommended way to handle such scenarios is to use Espresso idling resources:
    // https://google.github.io/android-testing-support-library/docs/espresso/idling-resource/index.html
    Thread.sleep(5000)
    Log.d(TAG,"Starting")
    try {
      ScreenShotter.takeScreenshot("tutorial_screen_1", EspressoHelper.getCurrentActivity());
      val roleEl = getEl("ion-button[aria-label=\"role-teacher\"]")
      roleEl.perform(webClick())
      Thread.sleep(1000)
      val signInSkipEl = getEl("ion-button[aria-label=\"google-sign-in-skip\"]")
      signInSkipEl.perform(webClick())
      Thread.sleep(1000)
      val analyticsConsentEl = getEl("ion-button[aria-label=\"privacy-consent-true\"]")
      analyticsConsentEl.perform(webClick())
      // Give time for problems to load
      Thread.sleep(3000)
    } catch (notExist: RuntimeException) {
      // if running on pre-configured device intro screen might be disabled
    }
    Thread.sleep(1000)
    ScreenShotter.takeScreenshot("todays_sessions_screen", EspressoHelper.getCurrentActivity());
    val cardEl = getEl("ion-card")
    cardEl.perform(webClick())
    Thread.sleep(1000)
    ScreenShotter.takeScreenshot("session_details_screen", EspressoHelper.getCurrentActivity());
    try {
      val downloadEl = getEl("ion-button[aria-label=\"download-session-guide\"]")
      downloadEl.perform(webClick())
      // give time to download
      Thread.sleep(15000)
    } catch (notExist: RuntimeException) {
      // possible already downloaded
    }
    val goToSessionEl = getEl("ion-button[aria-label=\"go-to-session\"]")
    goToSessionEl.perform(webClick())
    Thread.sleep(3000)
    takeScreenshot("session_open_screen");
    Thread.sleep(5000)
  }

  private fun getEl(cssSelector: String): Web.WebInteraction<Void> {
    Log.d(TAG, "getEl: "+cssSelector)
    return onWebView().withElement(findElement(Locator.CSS_SELECTOR, cssSelector))
  }

  private fun takeScreenshot(name: String) {
    ScreenShotter.takeScreenshot(name, EspressoHelper.getCurrentActivity());
    Screengrab.screenshot(name)
  }

  // screenshotter needs current activity, code here to return
  //  https://stackoverflow.com/questions/38737127/espresso-how-to-get-current-activity-to-test-fragments/58684943#58684943
  object EspressoHelper {
    fun getCurrentActivity(): Activity? {
      var currentActivity: Activity? = null
      InstrumentationRegistry.getInstrumentation().runOnMainSync { run { currentActivity = ActivityLifecycleMonitorRegistry.getInstance().getActivitiesInStage(Stage.RESUMED).elementAtOrNull(0) } }
      return currentActivity
    }
  }
}
