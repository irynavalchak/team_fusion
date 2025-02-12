'use client';

import React, {FC, useState, useRef, useEffect} from 'react';
import {Container, Form, Button, Card} from 'react-bootstrap';

import MDReader from 'helpers/mdHelper';

import styles from './aiAssistant.module.css';

const AIAssistantPage: FC = () => {
  const [messages, setMessages] = useState<{sender: string; text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const addedFiles = await MDReader();

        setContext(addedFiles);
      } catch (error) {
        console.error('Error loading context:', error);
      }
    };

    loadContext();
  }, []);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, {sender: 'User', text: userMessage}];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    try {
      const response = await fetch('/api/ai_assistant', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({messages: newMessages, context})
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, {sender: 'AI', text: data.text}]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {sender: 'AI', text: 'Error processing your request. Try again later.'}]);
    } finally {
      setIsLoading(false);
    }
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messageAreaRef]);

  return (
    <Container className={styles.chatContainer}>
      <h1 className="text-center my-4 font-bold">AI Assistant</h1>
      <Card className={styles.chatBox}>
        <Card.Body>
          <div className={styles.messageArea} ref={messageAreaRef} style={{overflowY: 'auto', maxHeight: '60vh'}}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === 'User' ? styles.userMessage : styles.aiMessage}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className={styles.aiMessage}>
                <em>AI is typing...</em>
              </div>
            )}
          </div>
          <Form className={styles.inputContainer} onSubmit={e => e.preventDefault()}>
            <Form.Control
              as="textarea"
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                autoResizeTextarea();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              style={{resize: 'none', overflow: 'hidden'}}
              disabled={isLoading}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              className="ms-2"
              disabled={isLoading || input.trim() === ''}>
              Send
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AIAssistantPage;
