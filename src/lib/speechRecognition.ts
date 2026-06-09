export type SpeechRecognitionState = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported';

type RecognitionConstructor = new () => SpeechRecognitionLike;

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence?: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  error?: string;
  message?: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  }
}

function getSpeechRecognitionConstructor() {
  if (typeof window === 'undefined') return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

export function isSpeechRecognitionSupported(): boolean {
  return Boolean(getSpeechRecognitionConstructor());
}

export function createSpeechRecognizer(options: {
  lang: 'ru-RU' | 'uz-UZ' | 'en-US';
  interimResults?: boolean;
  onResult: (transcript: string, interimTranscript: string, confidence?: number) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}) {
  const Recognition = getSpeechRecognitionConstructor();
  if (!Recognition) {
    return {
      start: () => options.onError('unsupported'),
      stop: () => undefined,
      abort: () => undefined,
    };
  }

  const recognition = new Recognition();
  recognition.lang = options.lang;
  recognition.interimResults = options.interimResults ?? true;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    let transcript = '';
    let interim = '';
    let confidence: number | undefined;
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const alternative = result[0];
      if (result.isFinal) {
        transcript += alternative.transcript;
        confidence = alternative.confidence;
      } else {
        interim += alternative.transcript;
      }
    }
    options.onResult(transcript.trim(), interim.trim(), confidence);
  };

  recognition.onerror = (event) => {
    options.onError(event.error ?? event.message ?? 'speech-recognition-error');
  };
  recognition.onend = options.onEnd;

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    abort: () => recognition.abort(),
  };
}
