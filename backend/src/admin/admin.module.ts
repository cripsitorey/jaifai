import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    AdminModule.createAdminAsync({
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: async (prisma: PrismaService) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const path = require('path');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const fs = require('fs');
            
            const dmmfPath = path.join(__dirname, 'dmmf.json');
            console.error('AdminModule: Loading DMMF from', dmmfPath);
            
            let dmmf;
            try {
                const content = fs.readFileSync(dmmfPath, 'utf8');
                dmmf = JSON.parse(content);
            } catch (e) {
                console.error('AdminModule: Failed to read/parse DMMF JSON', e);
            }

            console.log('AdminModule: DMMF loaded:', !!dmmf);
            
            if (!dmmf) {
                console.error('AdminModule: FATAL - DMMF JSON is empty');
                throw new Error('DMMF not found - run node generate-dmmf.js');
            }

            // Monkey-patch DMMF onto Prisma instance for Adapter to use
            if ((dmmf as any).datamodel && (dmmf as any).datamodel.enums) {
                const enums = (dmmf as any).datamodel.enums;
                (dmmf as any).datamodelEnumMap = enums.reduce((acc: any, curr: any) => {
                    acc[curr.name] = curr;
                    return acc;
                }, {});
            }
            
            (prisma as any)._dmmf = dmmf;
            (prisma as any)._baseDmmf = dmmf;
            
            const modelMap = (dmmf as any).modelMap;
            const datamodel = (dmmf as any).datamodel;
            
            const models = modelMap 
            ? Object.values(modelMap) 
            : datamodel.models;
            
            console.log('AdminModule: Found models count:', models.length);

            return {
                adminJsOptions: {
                    rootPath: '/admin',
                    resources: models.map((model: any) => ({
                        resource: { model, client: prisma },
                        options: {},
                    })),
                    locale: {
                        language: 'es',
                        translations: {
                            labels: {
                                loginWelcome: 'Bienvenido al Panel de Administración',
                                resources: 'Recursos',
                                dashboard: 'Tablero Principal',
                                Tenant: 'Condominios (Tenants)',
                                Property: 'Propiedades / Unidades',
                                User: 'Usuarios / Residentes',
                                Poll: 'Votaciones',
                                PollOption: 'Opciones de Voto',
                                VoteReceipt: 'Recibos de Voto (Auditoría)',
                                AuditLog: 'Registros del Sistema',
                            },
                            buttons: {
                                login: 'Iniciar Sesión',
                                save: 'Guardar',
                                filter: 'Filtrar',
                            },
                            messages: {
                                loginWelcome: 'Por favor inicie sesión para continuar',
                            }
                        }
                    },
                },
            };
        } catch (error) {
            console.error('AdminModule: Error during initialization:', error);
            throw error;
        }
      },
    }),
  ],
})
export class BackOfficeModule {}
