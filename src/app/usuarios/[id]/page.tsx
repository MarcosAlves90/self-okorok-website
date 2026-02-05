import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AvatarDisplay from '@/components/atoms/AvatarDisplay';
import BackButton from '@/components/pages-components/usuarios/atoms/BackButton';
import { query } from '@/lib/database';

type Props = { params: Promise<{ id: string }> };

type User = {
	id: string;
	name?: string | null;
	avatarUrl?: string | null;
	bio?: string | null;
};

async function fetchUser(id: string): Promise<User | null> {
	try {
		// Validação do ID
		if (!id) {
			return null;
		}

		// Buscar usuário diretamente no banco de dados
		const result = await query(
			'SELECT id, name, email, avatar_url, bio, created_at, updated_at FROM users WHERE id = $1',
			[id]
		);

		if (!result.rows || result.rows.length === 0) {
			return null;
		}

		const user = result.rows[0];
		return {
			id: user.id,
			name: user.name,
			avatarUrl: user.avatar_url || null,
			bio: user.bio || null,
		};

	} catch (error) {
		console.error('Erro ao obter usuário:', error);
		return null;
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	if (!id) return { title: 'Perfil' };

	const user = await fetchUser(id);
	if (!user) notFound();
	return { title: user.name || 'Perfil' };
}

export default async function UserProfilePage({ params }: Props) {
	const { id } = await params;
	if (!id) notFound();

	const user = await fetchUser(id);
	if (!user) notFound();

	return (
		<main className="min-h-[calc(100vh-82px)] mt-[82px] flex flex-col justify-center items-center py-10 sm:py-16 lg:py-20 px-[var(--pc-padding)]">
			<div className="relative border-2 border-foreground px-6 sm:px-10 lg:px-20 py-10 sm:py-14 lg:py-17 max-w-6xl w-full flex flex-col gap-6 rounded-xl h-full text-center text-foreground">
				<div className="flex flex-col items-center gap-4 mt-2 sm:mt-4">
					<div className='flex flex-col items-center'>
						<AvatarDisplay size={140} src={user.avatarUrl ?? null} />
						<h3 className="text-base sm:text-lg font-semibold text-foreground mt-2">{user.name || 'Usuário'}</h3>
					</div>

					<div className="w-full max-w-md mt-4 text-left">
						<label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">Bio</label>
						<div id="bio" className="w-full bg-background-gray placeholder:text-foreground/60 border-2 border-foreground rounded-xl px-4 py-3 text-sm text-foreground" style={{ whiteSpace: 'pre-wrap' }}>
							{user.bio || 'Nenhuma bio informada.'}
						</div>
					</div>

					<div className='max-w-md w-full mt-4'>
						<BackButton />
					</div>
				</div>
			</div>
		</main>
	);
}
