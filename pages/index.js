import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [dealInput, setDealInput] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deal: dealInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result.replace(/\n/g, ''));
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Deal AI Demo</title>
        <link rel="icon" href="/ai.gif" />
      </Head>

      <main className={styles.main}>
        <img src="/robot-amp.png" className={styles.icon} />
        <h3>AMP Deal Bot</h3>
        <form onSubmit={onSubmit}>
          <textarea
            name="deal"
            placeholder="Tell me a bit about the deal you would like to run?"
            value={dealInput}
            onChange={(e) => { setDealInput(e.target.value)}}
          />
          <br/>
          <input type="submit" value="Easy Button" />
        </form>
        
        {loading ? (
          <div className={styles.loading}>
            <img src="/ai.gif" className={styles.loadingImage} />
            <text>Transmitting your request to <br></br> Opportunity Mars rover for processing...</text>
          </div>
        ) : (
          <div id="deal-container" className={styles.result} dangerouslySetInnerHTML={{__html: result}}></div>
        )}
      </main>
    </div>
  );
}
