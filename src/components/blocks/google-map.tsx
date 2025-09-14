// components/blocks/google-map.tsx

type GoogleMapProps = {
  address?: string;
  height?: number;
};

export function GoogleMap({ address, height = 600 }: GoogleMapProps) {
  const encoded = encodeURIComponent(address ?? "");
  const src = `https://www.google.com/maps?q=${encoded}&output=embed`;

  return (
    <div className="flex w-full justify-center px-6 py-4">
      <div
        className="w-full overflow-hidden rounded-md shadow max-w-screen-xl"
        style={{ height }}
      >
        <iframe
          title={`Map of ${address}`}
          src={src}
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
