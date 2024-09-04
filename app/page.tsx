// app/page.tsx
"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('HTML code');
  const [textareaContent, setTextareaContent] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`;
    script.addEventListener('load', () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: function(data: any, actions: any) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '5.00' // Set the donation amount here
                }
              }]
            });
          },
          onApprove: function(data: any, actions: any) {
            return actions.order.capture().then(async function(details: any) {
              // Send payment details to the backend
              const response = await fetch('/api/payment-success', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderID: data.orderID, payerID: data.payerID, paymentDetails: details })
              });

              if (response.ok) {
                alert('Donation successful! Thank you, ' + details.payer.name.given_name);
                // Optionally, redirect the user or update the UI
                // window.location.href = '/thank-you';
              } else {
                alert('There was an issue processing your donation. Please contact support.');
              }
            });
          }
        }).render('#paypal-button-container');
      }
    });
    document.body.appendChild(script);
  }, []);

  const handleGenerate = async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input, type })
    });


    if (response.ok) {
      const data = await response.json();
      setOutput(data.output);
    } else {
      console.error('Failed to generate output');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">TarzanAI</h1>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <select
          value={type}
          onChange={(e) => {setType(e.target.value);setInput('');setOutput('');}}
          
          className="mt-4 p-2 border rounded bg-white text-black"
        >
          <option value="HTML code" className="text-black">HTML code</option>
          <option value="JUnit" className="text-black">JUnit</option>
          <option value="Java code" className="text-black">Java code</option>
        </select>
      </div>
      <div className="flex mt-4">
        <textarea
          className="textarea w-1/2 h-64 p-2 border rounded mr-4 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <textarea
          className="textarea w-1/2 h-64 p-2 border rounded text-black"
          value={output}
          readOnly
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button
          onClick={handleGenerate}
          className=" button-primary rounded button-spacing"
        >
          Generate
        </button>
        <button
          onClick={() => setInput('')}
          className=" button-primary rounded"
        >
          Clear
        </button>
      </div>
      <p className="mt-4 text-white-500">If you find this tool helpful, consider making a donation to support its development. Every Dollar matters, Thanks!!</p>
      <div id="paypal-button-container" className="mt-4"></div>
    </div>
  );
}